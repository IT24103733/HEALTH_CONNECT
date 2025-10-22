package com.example.app.dto;

import jakarta.validation.constraints.NotBlank;

public class SupportTicketRequest {
    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    public SupportTicketRequest() {
    }

    public SupportTicketRequest(String subject, String description) {
        this.subject = subject;
        this.description = description;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
