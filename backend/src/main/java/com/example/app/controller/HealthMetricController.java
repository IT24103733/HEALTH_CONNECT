package com.example.app.controller;

import com.example.app.dto.HealthMetricDTO;
import com.example.app.dto.HealthMetricRequest;
import com.example.app.dto.HealthTrendDTO;
import com.example.app.entity.User;
import com.example.app.exception.UnauthorizedException;
import com.example.app.exception.ValidationException;
import com.example.app.service.HealthMetricService;
import com.example.app.service.UserService;
import com.example.app.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/health-metrics")
public class HealthMetricController {
    private final HealthMetricService healthMetricService;
    private final UserService userService;
    private final AuthUtil authUtil;

    public HealthMetricController(HealthMetricService healthMetricService, UserService userService, AuthUtil authUtil) {
        this.healthMetricService = healthMetricService;
        this.userService = userService;
        this.authUtil = authUtil;
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<HealthMetricDTO> logMetric(@Valid @RequestBody HealthMetricRequest request, Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        
        if (!currentUser.getId().equals(request.getUserId())) {
            throw new ValidationException("Cannot log metrics for other users");
        }
        
        HealthMetricDTO metric = HealthMetricDTO.fromEntity(
                healthMetricService.logMetric(request.getUserId(), request.getDate(), 
                        request.getCaloriesIntake(), request.getExerciseMinutes(), 
                        request.getWeight(), request.getSleepHours(), 
                        request.getWaterIntake(), request.getSymptoms()));
        return ResponseEntity.ok(metric);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HealthMetricDTO>> getUserMetrics(@PathVariable Long userId, Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        
        if (!currentUser.getId().equals(userId) && 
            currentUser.getRole() != User.Role.DOCTOR && 
            currentUser.getRole() != User.Role.DIETITIAN) {
            throw new UnauthorizedException("Unauthorized access to health metrics");
        }
        
        return ResponseEntity.ok(healthMetricService.getUserMetrics(userId));
    }

    @GetMapping("/user/{userId}/range")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HealthMetricDTO>> getUserMetricsInRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        
        if (!currentUser.getId().equals(userId) && 
            currentUser.getRole() != User.Role.DOCTOR && 
            currentUser.getRole() != User.Role.DIETITIAN) {
            throw new UnauthorizedException("Unauthorized access to health metrics");
        }
        
        return ResponseEntity.ok(healthMetricService.getUserMetricsInRange(userId, startDate, endDate));
    }



    @GetMapping("/user/{userId}/trends/weekly")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HealthTrendDTO>> getWeeklyTrends(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        
        if (!currentUser.getId().equals(userId) && 
            currentUser.getRole() != User.Role.DOCTOR && 
            currentUser.getRole() != User.Role.DIETITIAN) {
            throw new UnauthorizedException("Unauthorized access to health metrics");
        }
        
        return ResponseEntity.ok(healthMetricService.getWeeklyTrends(userId, startDate, endDate));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Void> deleteHealthMetric(@PathVariable Long id, Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        healthMetricService.deleteHealthMetric(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
