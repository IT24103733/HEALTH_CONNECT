package com.example.app.service;

import com.example.app.entity.AccessLog;
import com.example.app.repository.AccessLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccessLogService {
    private final AccessLogRepository accessLogRepository;

    public AccessLogService(AccessLogRepository accessLogRepository) {
        this.accessLogRepository = accessLogRepository;
    }

    @Transactional
    public void logAccess(Long userId, String action, String resource, String ipAddress) {
        AccessLog log = new AccessLog(null, userId, action, resource, LocalDateTime.now(), ipAddress);
        accessLogRepository.save(log);
    }

    public List<AccessLog> getUserLogs(Long userId) {
        return accessLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public List<AccessLog> getLogsInRange(LocalDateTime start, LocalDateTime end) {
        return accessLogRepository.findByTimestampBetweenOrderByTimestampDesc(start, end);
    }

    public List<AccessLog> getAllLogs() {
        return accessLogRepository.findAll();
    }

    public List<AccessLog> getUserLogsInRange(Long userId, LocalDateTime start, LocalDateTime end) {
        return accessLogRepository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(userId, start, end);
    }
}
