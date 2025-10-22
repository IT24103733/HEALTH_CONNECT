package com.example.app.dto;

import com.example.app.entity.Message;
import java.time.LocalDateTime;

public class MessageDTO {
    private final Long id;
    private final Long senderId;
    private final Long recipientId;
    private final String content;
    private final LocalDateTime timestamp;
    private final boolean isRead;
    private final Long ticketId;

    public MessageDTO(Long id, Long senderId, Long recipientId, String content, 
                     LocalDateTime timestamp, boolean isRead, Long ticketId) {
        this.id = id;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.content = content;
        this.timestamp = timestamp;
        this.isRead = isRead;
        this.ticketId = ticketId;
    }

    public Long getId() {
        return id;
    }

    public Long getSenderId() {
        return senderId;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public boolean isRead() {
        return isRead;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public static MessageDTO fromEntity(Message message) {
        return new MessageDTO(message.getId(), message.getSenderId(), 
                            message.getRecipientId(), message.getContent(), 
                            message.getTimestamp(), message.isRead(), message.getTicketId());
    }
}
