package nelon.arrive.nelonshift.repository;

import nelon.arrive.nelonshift.entity.Project;
import nelon.arrive.nelonshift.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, Long> {

	boolean existsByName(String name);

	Optional<Project> findByIdAndUserId(Long id, UUID userId);

	@Query("""
		SELECT p FROM Project p
		WHERE p.user.id = :userId
		AND (:name IS NULL OR :name = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))
		AND (:status IS NULL OR p.status = :status)
		""")
	Page<Project> findByUserFilters(
		@Param("userId") UUID userId,
		@Param("name") String name,
		@Param("status") ProjectStatus status,
		Pageable pageable
	);

	@Query("""
		SELECT p FROM Project p
		WHERE p.user.id = :userId
		AND (:name IS NULL OR :name = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))
		AND (:status IS NULL OR p.status = :status)
		ORDER BY (
			SELECT COALESCE(SUM(s.compensation), 0)
			FROM Shift s WHERE s.project.id = p.id
		) DESC
		""")
	Page<Project> findByUserFiltersOrderByTotalPayDesc(
		@Param("userId") UUID userId,
		@Param("name") String name,
		@Param("status") ProjectStatus status,
		Pageable pageable
	);

	@Query("""
		SELECT p FROM Project p
		WHERE p.user.id = :userId
		AND (:name IS NULL OR :name = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))
		AND (:status IS NULL OR p.status = :status)
		ORDER BY (
			SELECT COALESCE(SUM(s.compensation), 0)
			FROM Shift s WHERE s.project.id = p.id
		) ASC
		""")
	Page<Project> findByUserFiltersOrderByTotalPayAsc(
		@Param("userId") UUID userId,
		@Param("name") String name,
		@Param("status") ProjectStatus status,
		Pageable pageable
	);
}
