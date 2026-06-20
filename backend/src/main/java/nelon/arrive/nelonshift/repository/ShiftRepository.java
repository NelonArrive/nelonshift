package nelon.arrive.nelonshift.repository;

import nelon.arrive.nelonshift.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ShiftRepository extends JpaRepository<Shift, Long> {
	List<Shift> findByProjectId(Long projectId);

	long countByProjectId(Long projectId);

	@Query("SELECT COALESCE(SUM(s.compensation), 0) FROM Shift s WHERE s.project.id = :projectId")
	BigDecimal sumCompensationByProjectId(@Param("projectId") Long projectId);

	boolean existsByProjectIdAndDate(Long projectId, LocalDate date);
}