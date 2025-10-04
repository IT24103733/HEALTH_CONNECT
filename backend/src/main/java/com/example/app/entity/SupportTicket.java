package com.example.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    private Long assignedStaffId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected SupportTicket() {
        this.createdAt = LocalDateTime.now();
        this.status = TicketStatus.OPEN;
    }

    public SupportTicket(Long id, Long patientId, String subject, String description,
                        TicketStatus status, Long assignedStaffId, LocalDateTime createdAt) {
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

    public TicketStatus getStatus() {
        return status;
    }

    public Long getAssignedStaffId() {
        return assignedStaffId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public void setAssignedStaffId(Long assignedStaffId) {
        this.assignedStaffId = assignedStaffId;
    }

    public enum TicketStatus {
        OPEN, ASSIGNED, RESOLVED, CLOSED
    }
}
