package com.example.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CarePlanRequest {
    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Creator ID is required")
    private Long creatorId;

    @NotBlank(message = "Plan type is required")
    private String planType;

    @NotBlank(message = "Content is required")
    private String content;

    public CarePlanRequest() {
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
