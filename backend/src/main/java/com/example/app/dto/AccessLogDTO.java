package com.example.app.dto;

import com.example.app.entity.AccessLog;
import java.time.LocalDateTime;

public class AccessLogDTO {
    private final Long id;
    private final Long userId;
    private final String action;
    private final String resource;
    private final LocalDateTime timestamp;
    private final String ipAddress;

    public AccessLogDTO(Long id, Long userId, String action, String resource, 
                       LocalDateTime timestamp, String ipAddress) {
        this.id = id;
        this.userId = userId;
        this.action = action;
        this.resource = resource;
        this.timestamp = timestamp;
        this.ipAddress = ipAddress;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getAction() {
        return action;
    }

    public String getResource() {
        return resource;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public static AccessLogDTO fromEntity(AccessLog log) {
        return new AccessLogDTO(log.getId(), log.getUserId(), log.getAction(), 
                               log.getResource(), log.getTimestamp(), log.getIpAddress());
    }
}
