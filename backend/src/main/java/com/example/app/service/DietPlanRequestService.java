package com.example.app.service;

import com.example.app.dto.DietPlanRequestDTO;
import com.example.app.entity.DietPlanRequest;
import com.example.app.entity.User;
import com.example.app.repository.DietPlanRequestRepository;
import com.example.app.util.HtmlSanitizer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DietPlanRequestService {
    private final DietPlanRequestRepository requestRepository;
    private final HtmlSanitizer htmlSanitizer;

    public DietPlanRequestService(DietPlanRequestRepository requestRepository, HtmlSanitizer htmlSanitizer) {
        this.requestRepository = requestRepository;
        this.htmlSanitizer = htmlSanitizer;
    }

    @Transactional
    public DietPlanRequest createRequest(Long patientId, Integer age, Double weight, Double height,
                                        String dietaryRestrictions, String healthGoals, String activityLevel) {
        int openCount = requestRepository.countByPatientIdAndStatus(patientId, DietPlanRequest.RequestStatus.PENDING);
        if (openCount >= 3) {
            throw new RuntimeException("Maximum 3 open requests allowed per patient");
        }

        String sanitizedRestrictions = htmlSanitizer.sanitize(dietaryRestrictions);
        String sanitizedGoals = htmlSanitizer.sanitize(healthGoals);
        String sanitizedActivity = htmlSanitizer.sanitize(activityLevel);

        DietPlanRequest request = new DietPlanRequest(null, patientId, age, weight, height,
                sanitizedRestrictions, sanitizedGoals, sanitizedActivity,
                DietPlanRequest.RequestStatus.PENDING, null, LocalDateTime.now());
        return requestRepository.save(request);
    }

    @Transactional
    public DietPlanRequest updateRequest(Long requestId, Long patientId, Double weight, Double height,
                                        String dietaryRestrictions, String healthGoals, String activityLevel) {
        DietPlanRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (!request.getPatientId().equals(patientId)) {
            throw new RuntimeException("Unauthorized access");
        }

        request.setWeight(weight);
        request.setHeight(height);
        request.setDietaryRestrictions(htmlSanitizer.sanitize(dietaryRestrictions));
        request.setHealthGoals(htmlSanitizer.sanitize(healthGoals));
        request.setActivityLevel(htmlSanitizer.sanitize(activityLevel));
        
        return requestRepository.save(request);
    }

    @Transactional
    public void deleteRequest(Long requestId, Long patientId) {
        DietPlanRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (!request.getPatientId().equals(patientId)) {
            throw new RuntimeException("Unauthorized access");
        }

        requestRepository.delete(request);
    }

    @Transactional
    public DietPlanRequest acceptRequest(Long requestId, Long dieticianId) {
        DietPlanRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (request.getStatus() != DietPlanRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Request already accepted");
        }

        request.setStatus(DietPlanRequest.RequestStatus.ACCEPTED);
        request.setAssignedDieticianId(dieticianId);
        return requestRepository.save(request);
    }

    public List<DietPlanRequestDTO> getPendingRequests() {
        return requestRepository.findByStatus(DietPlanRequest.RequestStatus.PENDING).stream()
                .map(DietPlanRequestDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DietPlanRequestDTO> getPatientRequests(Long patientId) {
        return requestRepository.findByPatientIdAndStatus(patientId, DietPlanRequest.RequestStatus.PENDING).stream()
                .map(DietPlanRequestDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DietPlanRequestDTO> getDieticianRequests(Long dieticianId) {
        return requestRepository.findByAssignedDieticianId(dieticianId).stream()
                .map(DietPlanRequestDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
