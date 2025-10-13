package com.example.app.controller;

import com.example.app.entity.AccessLog;
import com.example.app.entity.User;
import com.example.app.service.AccessLogService;
import com.example.app.service.UserService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/compliance")
public class ComplianceController {
    private final AccessLogService accessLogService;
    private final UserService userService;

    public ComplianceController(AccessLogService accessLogService, UserService userService) {
        this.accessLogService = accessLogService;
        this.userService = userService;
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AccessLog>> getAccessLogs(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Authentication auth) {
        
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != User.Role.SYSTEM_ADMIN && user.getRole() != User.Role.SUPER_ADMIN) {
            throw new RuntimeException("Unauthorized access");
        }

        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(accessLogService.getLogsInRange(startDate, endDate));
        }
        
        return ResponseEntity.ok(accessLogService.getAllLogs());
    }

    @GetMapping("/logs/user/{userId}")
    public ResponseEntity<List<AccessLog>> getUserLogs(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != User.Role.SYSTEM_ADMIN && user.getRole() != User.Role.SUPER_ADMIN) {
            throw new RuntimeException("Unauthorized access");
        }

        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(accessLogService.getUserLogsInRange(userId, startDate, endDate));
        }

        return ResponseEntity.ok(accessLogService.getUserLogs(userId));
    }

    @GetMapping("/export/csv")
    public ResponseEntity<String> exportLogsToCSV(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Authentication auth) {
        
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != User.Role.SYSTEM_ADMIN && user.getRole() != User.Role.SUPER_ADMIN) {
            throw new RuntimeException("Unauthorized access");
        }

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
