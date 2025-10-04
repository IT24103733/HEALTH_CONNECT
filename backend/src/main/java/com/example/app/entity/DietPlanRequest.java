package com.example.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "diet_plan_requests")
public class DietPlanRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private Double height;

    @Column(nullable = false)
    private String dietaryRestrictions;

    @Column(nullable = false)
    private String healthGoals;

    @Column(nullable = false)
    private String activityLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    private Long assignedDieticianId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected DietPlanRequest() {
        this.createdAt = LocalDateTime.now();
        this.status = RequestStatus.PENDING;
    }

    public DietPlanRequest(Long id, Long patientId, Integer age, Double weight, Double height,
                          String dietaryRestrictions, String healthGoals, String activityLevel,
                          RequestStatus status, Long assignedDieticianId, LocalDateTime createdAt) {
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

    public RequestStatus getStatus() {
        return status;
    }

    public Long getAssignedDieticianId() {
        return assignedDieticianId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public void setAssignedDieticianId(Long assignedDieticianId) {
        this.assignedDieticianId = assignedDieticianId;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public void setDietaryRestrictions(String dietaryRestrictions) {
        this.dietaryRestrictions = dietaryRestrictions;
    }

    public void setHealthGoals(String healthGoals) {
        this.healthGoals = healthGoals;
    }

    public void setActivityLevel(String activityLevel) {
        this.activityLevel = activityLevel;
    }

    public enum RequestStatus {
        PENDING, ACCEPTED, COMPLETED, CANCELLED
    }
}
