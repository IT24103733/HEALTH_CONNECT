package com.example.app.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateCarePlanContentRequest {
    @NotBlank(message = "Content is required")
    private String content;

    public UpdateCarePlanContentRequest() {
    }

    public UpdateCarePlanContentRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
