package com.example.app.dto;

import com.example.app.entity.Appointment;
import java.time.LocalDateTime;

public class AppointmentDTO {
    private final Long id;
    private final Long patientId;
    private final Long clinicianId;
    private final LocalDateTime scheduledTime;
    private final String status;
    private final String notes;

    public AppointmentDTO(Long id, Long patientId, Long clinicianId, LocalDateTime scheduledTime,
                         String status, String notes) {
        this.id = id;
        this.patientId = patientId;
        this.clinicianId = clinicianId;
        this.scheduledTime = scheduledTime;
        this.status = status;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public Long getClinicianId() {
        return clinicianId;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public String getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public static AppointmentDTO fromEntity(Appointment appointment) {
        return new AppointmentDTO(appointment.getId(), appointment.getPatientId(),
                                 appointment.getClinicianId(), appointment.getScheduledTime(),
                                 appointment.getStatus().name(), appointment.getNotes());
    }
}
