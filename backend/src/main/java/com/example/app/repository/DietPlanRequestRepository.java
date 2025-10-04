package com.example.app.repository;

import com.example.app.entity.DietPlanRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DietPlanRequestRepository extends JpaRepository<DietPlanRequest, Long> {
    List<DietPlanRequest> findByPatientIdAndStatus(Long patientId, DietPlanRequest.RequestStatus status);
    List<DietPlanRequest> findByStatus(DietPlanRequest.RequestStatus status);
    List<DietPlanRequest> findByAssignedDieticianId(Long dieticianId);
    int countByPatientIdAndStatus(Long patientId, DietPlanRequest.RequestStatus status);
}
