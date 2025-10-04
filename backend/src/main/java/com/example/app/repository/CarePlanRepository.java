package com.example.app.repository;

import com.example.app.entity.CarePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarePlanRepository extends JpaRepository<CarePlan, Long> {
    List<CarePlan> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<CarePlan> findByCreatorIdOrderByCreatedAtDesc(Long creatorId);
}
