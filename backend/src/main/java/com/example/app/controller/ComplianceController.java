package com.example.app.controller;

import com.example.app.dto.AccessLogDTO;
import com.example.app.entity.AccessLog;
import com.example.app.service.AccessLogService;
import java.util.stream.Collectors;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/compliance")
public class ComplianceController {
    private final AccessLogService accessLogService;

    public ComplianceController(AccessLogService accessLogService) {
        this.accessLogService = accessLogService;
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<AccessLogDTO>> getAccessLogs(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<AccessLog> logs;
        if (startDate != null && endDate != null) {
            logs = accessLogService.getLogsInRange(startDate, endDate);
        } else {
            logs = accessLogService.getAllLogs();
        }
        
        return ResponseEntity.ok(logs.stream()
                .map(AccessLogDTO::fromEntity)
                .collect(Collectors.toList()));
    }

    @GetMapping("/logs/user/{userId}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<AccessLogDTO>> getUserLogs(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<AccessLog> logs;
        if (startDate != null && endDate != null) {
            logs = accessLogService.getUserLogsInRange(userId, startDate, endDate);
        } else {
            logs = accessLogService.getUserLogs(userId);
        }

        return ResponseEntity.ok(logs.stream()
                .map(AccessLogDTO::fromEntity)
                .collect(Collectors.toList()));
    }

    @GetMapping("/export/csv")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<String> exportLogsToCSV(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<AccessLog> logs;
        if (startDate != null && endDate != null) {
            logs = accessLogService.getLogsInRange(startDate, endDate);
        } else {
            logs = accessLogService.getAllLogs();
        }

        StringBuilder csv = new StringBuilder();
        csv.append("ID,User ID,Action,Resource,Timestamp,IP Address\n");
        
        for (AccessLog log : logs) {
            csv.append(log.getId()).append(",")
               .append(log.getUserId()).append(",")
               .append(log.getAction()).append(",")
               .append(log.getResource()).append(",")
               .append(log.getTimestamp()).append(",")
               .append(log.getIpAddress()).append("\n");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "access_logs.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }
}
