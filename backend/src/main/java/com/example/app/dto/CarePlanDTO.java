package com.example.app.dto;

import com.example.app.entity.CarePlan;
import java.time.LocalDateTime;

public class CarePlanDTO {
    private final Long id;
    private final Long patientId;
    private final Long creatorId;
    private final String planType;
    private final String content;
    private final LocalDateTime createdAt;
    private final Double adherencePercentage;

    public CarePlanDTO(Long id, Long patientId, Long creatorId, String planType,
                      String content, LocalDateTime createdAt, Double adherencePercentage) {
        this.id = id;
        this.patientId = patientId;
        this.creatorId = creatorId;
        this.planType = planType;
        this.content = content;
        this.createdAt = createdAt;
        this.adherencePercentage = adherencePercentage;
    }

    public Long getId() {
        return id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public String getPlanType() {
        return planType;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Double getAdherencePercentage() {
        return adherencePercentage;
    }

    public static CarePlanDTO fromEntity(CarePlan plan) {
        return new CarePlanDTO(plan.getId(), plan.getPatientId(), plan.getCreatorId(),
                              plan.getPlanType().name(), plan.getContent(), plan.getCreatedAt(),
                              plan.getAdherencePercentage());
    }
}
