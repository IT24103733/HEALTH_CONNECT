package com.example.app.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {
    @NotNull(message = "Status is required")
    private String status;

    public UpdateStatusRequest() {
    }

    public UpdateStatusRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
