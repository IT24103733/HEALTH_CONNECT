package com.example.app.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class UpdateAdherenceRequest {
    @NotNull(message = "Adherence percentage is required")
    @DecimalMin(value = "0.0", message = "Adherence percentage must be at least 0")
    @DecimalMax(value = "100.0", message = "Adherence percentage must not exceed 100")
    private Double adherencePercentage;

    public UpdateAdherenceRequest() {
    }

    public UpdateAdherenceRequest(Double adherencePercentage) {
        this.adherencePercentage = adherencePercentage;
    }

    public Double getAdherencePercentage() {
        return adherencePercentage;
    }

    public void setAdherencePercentage(Double adherencePercentage) {
        this.adherencePercentage = adherencePercentage;
    }
}
