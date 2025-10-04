package com.example.app.dto;

import com.example.app.entity.SupportTicket;
import java.time.LocalDateTime;

public class SupportTicketDTO {
    private final Long id;
    private final Long patientId;
    private final String subject;
    private final String description;
    private final String status;
    private final Long assignedStaffId;
    private final LocalDateTime createdAt;

    public SupportTicketDTO(Long id, Long patientId, String subject, String description,
                           String status, Long assignedStaffId, LocalDateTime createdAt) {
        this.id = id;
        this.patientId = patientId;
        this.subject = subject;
        this.description = description;
        this.status = status;
        this.assignedStaffId = assignedStaffId;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public String getSubject() {
        return subject;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public Long getAssignedStaffId() {
        return assignedStaffId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public static SupportTicketDTO fromEntity(SupportTicket ticket) {
        return new SupportTicketDTO(ticket.getId(), ticket.getPatientId(), ticket.getSubject(),
                ticket.getDescription(), ticket.getStatus().name(), ticket.getAssignedStaffId(),
                ticket.getCreatedAt());
    }
}
