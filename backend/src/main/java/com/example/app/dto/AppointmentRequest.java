package com.example.app.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class AppointmentRequest {
    @NotNull(message = "Clinician ID is required")
    private Long clinicianId;

    @NotNull(message = "Scheduled time is required")
    @Future(message = "Scheduled time must be in the future")
    private LocalDateTime scheduledTime;

    private String notes;

    public AppointmentRequest() {
    }

    public AppointmentRequest(Long clinicianId, LocalDateTime scheduledTime, String notes) {
        this.clinicianId = clinicianId;
        this.scheduledTime = scheduledTime;
        this.notes = notes;
    }

    public Long getClinicianId() {
        return clinicianId;
    }

    public void setClinicianId(Long clinicianId) {
        this.clinicianId = clinicianId;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
