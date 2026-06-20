package nelon.arrive.nelonshift.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nelon.arrive.nelonshift.dto.ProjectDto;
import nelon.arrive.nelonshift.dto.ProjectStatsDto;
import nelon.arrive.nelonshift.entity.Project;
import nelon.arrive.nelonshift.entity.Shift;
import nelon.arrive.nelonshift.entity.User;
import nelon.arrive.nelonshift.enums.ProjectStatus;
import nelon.arrive.nelonshift.exception.BadRequestException;
import nelon.arrive.nelonshift.exception.BusinessLogicException;
import nelon.arrive.nelonshift.exception.ResourceNotFoundException;
import nelon.arrive.nelonshift.mappers.ProjectMapper;
import nelon.arrive.nelonshift.repository.ProjectRepository;
import nelon.arrive.nelonshift.repository.ShiftRepository;
import nelon.arrive.nelonshift.request.CreateProjectRequest;
import nelon.arrive.nelonshift.request.UpdateProjectRequest;
import nelon.arrive.nelonshift.response.MessageResponse;
import nelon.arrive.nelonshift.response.PageResponse;
import nelon.arrive.nelonshift.services.interfaces.IProjectService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService implements IProjectService {
	
	private final ProjectRepository projectRepository;
	private final ShiftRepository shiftRepository;
	private final ProjectMapper projectMapper;
	private final AuthService authService;

	private static final int MAX_NAME_LENGTH = 100;
	private static final List<String> VALID_SORT_FIELDS = Arrays.asList("name", "status", "createdAt", "date");
	
	@Override
	@Transactional(readOnly = true)
	public PageResponse<ProjectDto> getProjects(
		String name,
		ProjectStatus status,
		int page,
		int size,
		String sortBy,
		String sortDirection
	) {
		User user = authService.getCurrentUser();
		String normalizedSortBy = sortBy != null ? sortBy.toLowerCase() : "date";

		if (!sortDirection.equalsIgnoreCase("asc") && !sortDirection.equalsIgnoreCase("desc")) {
			throw new BadRequestException("Sort direction must be 'asc' or 'desc'");
		}

		if (name != null && name.trim().length() > MAX_NAME_LENGTH) {
			throw new BadRequestException("Search name is too long (max " + MAX_NAME_LENGTH + " characters)");
		}

		String trimmedName = name != null && !name.isBlank() ? name.trim() : null;
		Pageable pageable = PageRequest.of(page, size);
		Page<Project> projectPage;

		if ("totalpay".equals(normalizedSortBy)) {
			projectPage = sortDirection.equalsIgnoreCase("desc")
				? projectRepository.findByUserFiltersOrderByTotalPayDesc(user.getId(), trimmedName, status, pageable)
				: projectRepository.findByUserFiltersOrderByTotalPayAsc(user.getId(), trimmedName, status, pageable);
		} else {
			String dbSortField = mapSortField(normalizedSortBy);

			if (!VALID_SORT_FIELDS.contains(dbSortField)) {
				throw new BadRequestException("Invalid sort field: " + sortBy);
			}

			Sort sort = sortDirection.equalsIgnoreCase("desc")
				? Sort.by(dbSortField).descending()
				: Sort.by(dbSortField).ascending();

			projectPage = projectRepository.findByUserFilters(
				user.getId(), trimmedName, status, PageRequest.of(page, size, sort)
			);
		}

		Page<ProjectDto> projectDtoPage = projectPage.map(this::toDtoWithStats);
		return new PageResponse<>(projectDtoPage);
	}
	
	@Override
	@Transactional(readOnly = true)
	public ProjectDto getProjectById(Long id) {
		Project project = getOwnedProject(id);
		return toDtoWithStats(project);
	}
	
	@Override
	public ProjectDto createProject(CreateProjectRequest request) {
		if (request.getStatus() == ProjectStatus.COMPLETED) {
			throw new BusinessLogicException("Cannot create a project with COMPLETED status");
		}
		
		User user = authService.getCurrentUser();
		
		validateProjectDates(request.getStartDate(), request.getEndDate());
		
		if (request.getStartDate() != null && request.getStartDate().isBefore(LocalDate.now())) {
			log.warn("Creating project with start date in the past: {}", request.getStartDate());
		}
		
		Project project = new Project();
		project.setName(request.getName());
		project.setStatus(request.getStatus());
		project.setStartDate(request.getStartDate());
		project.setEndDate(request.getEndDate());
		project.setTargetShiftCount(calculateTargetShiftCount(request.getStartDate(), request.getEndDate()));
		project.setUser(user);

		Project savedProject = projectRepository.save(project);

		log.info("Created project with id: {} and name: '{}'", savedProject.getId(), savedProject.getName());

		return toDtoWithStats(savedProject);
	}
	
	@Override
	public ProjectDto updateProject(Long id, UpdateProjectRequest request) {
		Project project = getOwnedProject(id);

		if (request.getName() != null) {
			project.setName(request.getName().trim());
		}
		if (request.getStatus() != null) {
			project.setStatus(request.getStatus());
		}

		LocalDate newStartDate = request.getStartDate() != null
			? request.getStartDate()
			: project.getStartDate();
		LocalDate newEndDate = request.getEndDate() != null
			? request.getEndDate()
			: project.getEndDate();

		validateProjectDates(newStartDate, newEndDate);

		if (request.getStartDate() != null || request.getEndDate() != null) {
			validateDateChangeWithShifts(project, newStartDate, newEndDate);
			project.setStartDate(newStartDate);
			project.setEndDate(newEndDate);
			project.setTargetShiftCount(calculateTargetShiftCount(newStartDate, newEndDate));
		}

		Project updatedProject = projectRepository.save(project);
		return toDtoWithStats(updatedProject);
	}

	public MessageResponse deleteProject(Long id) {
		getOwnedProject(id);

		projectRepository.deleteById(id);
		log.info("Deleted project with id: {}", id);
		
		return new MessageResponse("Delete project successfully");
	}
	
	@Transactional(readOnly = true)
	@Override
	public ProjectStatsDto getProjectStats(Long id) {
		Project project = getOwnedProject(id);
		Integer targetShiftCount = resolveTargetShiftCount(project);

		if (project.getShifts().isEmpty()) {
			String period = project.getStartDate() != null && project.getEndDate() != null
				? formatDateRange(project.getStartDate(), project.getEndDate())
				: "—";

			ProjectStatsDto emptyStats = ProjectStatsDto.empty(period);
			emptyStats.setTargetShiftCount(targetShiftCount);
			emptyStats.calculateDerivedValues();
			return emptyStats;
		}
		
		List<Shift> shifts = project.getShifts();
		
		BigDecimal totalBasePay = shifts.stream()
			.map(Shift::getBasePay)
			.filter(Objects::nonNull)
			.reduce(BigDecimal.ZERO, BigDecimal::add);
		
		BigDecimal totalOvertimePay = shifts.stream()
			.map(Shift::getOvertimePay)
			.filter(Objects::nonNull)
			.reduce(BigDecimal.ZERO, BigDecimal::add);
		
		BigDecimal totalPerDiem = shifts.stream()
			.map(Shift::getPerDiem)
			.filter(Objects::nonNull)
			.reduce(BigDecimal.ZERO, BigDecimal::add);
		
		BigDecimal totalEarnings = totalBasePay.add(totalOvertimePay).add(totalPerDiem);
		
		Integer totalHours = shifts.stream()
			.map(Shift::getHours)
			.filter(Objects::nonNull)
			.reduce(0, Integer::sum);
		
		LocalDate firstShiftDate = shifts.stream()
			.map(Shift::getDate)
			.min(LocalDate::compareTo)
			.orElse(null);
		
		LocalDate lastShiftDate = shifts.stream()
			.map(Shift::getDate)
			.max(LocalDate::compareTo)
			.orElse(null);
		
		String period = formatDateRange(firstShiftDate, lastShiftDate);
		
		Integer daysWorked = (int) ChronoUnit.DAYS.between(firstShiftDate, lastShiftDate) + 1;
		
		ProjectStatsDto stats = ProjectStatsDto.builder()
			.period(period)
			.daysWorked(daysWorked)
			.shiftCount(shifts.size())
			.totalHours(totalHours)
			.totalEarnings(totalEarnings)
			.totalBasePay(totalBasePay)
			.totalOvertimePay(totalOvertimePay)
			.totalPerDiem(totalPerDiem)
			.targetShiftCount(targetShiftCount)
			.build();
		
		stats.calculateDerivedValues();
		
		log.info("Calculated stats for project {}: {} shifts, {} total, {}₽/hour",
			id, stats.getShiftCount(), stats.getTotalEarnings(), stats.getHourlyRate());
		
		return stats;
	}
	
	private String formatDateRange(LocalDate from, LocalDate to) {
		DateTimeFormatter dayMonth = DateTimeFormatter.ofPattern("d MMMM", Locale.forLanguageTag("ru-RU"));
		DateTimeFormatter dayMonthYear = DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.forLanguageTag("ru-RU"));
		
		if (from.getYear() == to.getYear()) {
			// Один год: "5 января - 25 января 2025"
			return from.format(dayMonth) + " - " + to.format(dayMonthYear);
		} else {
			// Разные года: "28 декабря 2024 - 5 января 2025"
			return from.format(dayMonthYear) + " - " + to.format(dayMonthYear);
		}
	}
	
	private String mapSortField(String frontendSortBy) {
		return switch (frontendSortBy.toLowerCase()) {
			case "name" -> "name";
			case "status" -> "status";
			case "date" -> "createdAt";
			default -> "createdAt";
		};
	}

	private Project getOwnedProject(Long id) {
		User user = authService.getCurrentUser();
		return projectRepository.findByIdAndUserId(id, user.getId())
			.orElseThrow(() -> new ResourceNotFoundException("Проект не найден с ID: " + id));
	}

	private ProjectDto toDtoWithStats(Project project) {
		ProjectDto dto = projectMapper.toDto(project);
		dto.setShiftCount((int) shiftRepository.countByProjectId(project.getId()));
		dto.setTotalPay(shiftRepository.sumCompensationByProjectId(project.getId()));
		return dto;
	}

	private Integer calculateTargetShiftCount(LocalDate startDate, LocalDate endDate) {
		if (startDate == null || endDate == null) {
			return null;
		}
		return (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;
	}

	private Integer resolveTargetShiftCount(Project project) {
		Integer stored = project.getTargetShiftCount();
		if (stored != null) {
			return stored;
		}
		return calculateTargetShiftCount(project.getStartDate(), project.getEndDate());
	}
	
	// ===== ПРИВАТНЫЕ МЕТОДЫ ВАЛИДАЦИИ =====
	
	private void validateProjectDates(LocalDate startDate, LocalDate endDate) {
		if (startDate != null && endDate != null) {
			if (startDate.isAfter(endDate)) {
				throw new BadRequestException("Start date cannot be after end date");
			}
			
			if (startDate.plusYears(5).isBefore(endDate)) {
				throw new BadRequestException("Project duration cannot exceed 5 years");
			}
		}
		
		if (startDate != null && startDate.isBefore(LocalDate.now().minusYears(10))) {
			throw new BadRequestException("Start date cannot be more than 10 years in the past");
		}
		
		if (endDate != null && endDate.isAfter(LocalDate.now().plusYears(10))) {
			throw new BadRequestException("End date cannot be more than 10 years in the future");
		}
	}
	
	private void validateDateChangeWithShifts(Project project, LocalDate newStartDate, LocalDate newEndDate) {
		if (project.getShifts().isEmpty()) {
			return;
		}
		
		boolean hasShiftsOutsideRange = project.getShifts().stream()
			.anyMatch(shift -> {
				LocalDate shiftDate = shift.getDate();
				boolean outsideStart = newStartDate != null && shiftDate.isBefore(newStartDate);
				boolean outsideEnd = newEndDate != null && shiftDate.isAfter(newEndDate);
				return outsideStart || outsideEnd;
			});
		
		if (hasShiftsOutsideRange) {
			throw new BusinessLogicException(
				"Cannot change project dates: some shifts fall outside the new date range. " +
					"Update or delete those shifts first."
			);
		}
	}
}
