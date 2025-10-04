package com.example.app.dto;

import com.example.app.entity.DietPlanRequest;
import java.time.LocalDateTime;

public class DietPlanRequestDTO {
    private final Long id;
    private final Long patientId;
    private final Integer age;
    private final Double weight;
    private final Double height;
    private final String dietaryRestrictions;
    private final String healthGoals;
    private final String activityLevel;
    private final String status;
    private final Long assignedDieticianId;
    private final LocalDateTime createdAt;

    public DietPlanRequestDTO(Long id, Long patientId, Integer age, Double weight, Double height,
                             String dietaryRestrictions, String healthGoals, String activityLevel,
                             String status, Long assignedDieticianId, LocalDateTime createdAt) {
        this.id = id;
        this.patientId = patientId;
        this.age = age;
        this.weight = weight;
        this.height = height;
        this.dietaryRestrictions = dietaryRestrictions;
        this.healthGoals = healthGoals;
        this.activityLevel = activityLevel;
        this.status = status;
        this.assignedDieticianId = assignedDieticianId;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public Integer getAge() {
        return age;
    }

    public Double getWeight() {
        return weight;
    }

    public Double getHeight() {
        return height;
    }

    public String getDietaryRestrictions() {
        return dietaryRestrictions;
    }

    public String getHealthGoals() {
        return healthGoals;
    }

    public String getActivityLevel() {
        return activityLevel;
    }

    public String getStatus() {
        return status;
    }

    public Long getAssignedDieticianId() {
        return assignedDieticianId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public static DietPlanRequestDTO fromEntity(DietPlanRequest request) {
        return new DietPlanRequestDTO(request.getId(), request.getPatientId(), request.getAge(),
                request.getWeight(), request.getHeight(), request.getDietaryRestrictions(),
                request.getHealthGoals(), request.getActivityLevel(), request.getStatus().name(),
                request.getAssignedDieticianId(), request.getCreatedAt());
    }
}
