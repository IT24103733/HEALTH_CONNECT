package com.example.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "care_plans")
public class CarePlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private Long creatorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanType planType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Double adherencePercentage;

    protected CarePlan() {
        this.createdAt = LocalDateTime.now();
        this.adherencePercentage = 0.0;
    }

    public CarePlan(Long id, Long patientId, Long creatorId, PlanType planType, 
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

    public PlanType getPlanType() {
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

    public void setContent(String content) {
        this.content = content;
    }

    public void setAdherencePercentage(Double adherencePercentage) {
        this.adherencePercentage = adherencePercentage;
    }

    public enum PlanType {
        MEAL_PLAN, REHABILITATION_PROTOCOL, TREATMENT_PLAN
    }
}
