package com.example.app.service;

import com.example.app.dto.CarePlanDTO;
import com.example.app.entity.CarePlan;
import com.example.app.repository.CarePlanRepository;
import com.example.app.util.HtmlSanitizer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarePlanService {
    private final CarePlanRepository carePlanRepository;
    private final HtmlSanitizer htmlSanitizer;

    public CarePlanService(CarePlanRepository carePlanRepository, HtmlSanitizer htmlSanitizer) {
        this.carePlanRepository = carePlanRepository;
        this.htmlSanitizer = htmlSanitizer;
    }

    @Transactional
    public CarePlan createCarePlan(Long patientId, Long creatorId, CarePlan.PlanType planType, String content) {
        String sanitizedContent = htmlSanitizer.sanitize(content);
        CarePlan plan = new CarePlan(null, patientId, creatorId, planType, 
                                     sanitizedContent, LocalDateTime.now(), 0.0);
        return carePlanRepository.save(plan);
    }

    @Transactional
    public CarePlan updateCarePlan(Long id, String content, Long userId) {
        CarePlan plan = carePlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Care plan not found"));
        
        if (!plan.getCreatorId().equals(userId)) {
            throw new RuntimeException("Cannot update care plans created by other users");
        }
        
        String sanitizedContent = htmlSanitizer.sanitize(content);
        plan.setContent(sanitizedContent);
        return carePlanRepository.save(plan);
    }

    @Transactional
    public void updateAdherence(Long id, Double adherencePercentage) {
        CarePlan plan = carePlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Care plan not found"));
        plan.setAdherencePercentage(adherencePercentage);
        carePlanRepository.save(plan);
    }

    public List<CarePlanDTO> getPatientCarePlans(Long patientId) {
        return carePlanRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(CarePlanDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CarePlanDTO> getCreatorCarePlans(Long creatorId) {
        return carePlanRepository.findByCreatorIdOrderByCreatedAtDesc(creatorId).stream()
                .map(CarePlanDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
