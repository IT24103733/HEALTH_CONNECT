package com.example.app.repository;

import com.example.app.entity.HealthMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {
    List<HealthMetric> findByUserIdOrderByDateDesc(Long userId);
    List<HealthMetric> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
