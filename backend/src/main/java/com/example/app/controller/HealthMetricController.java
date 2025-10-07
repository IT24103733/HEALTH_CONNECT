package com.example.app.controller;

import com.example.app.dto.HealthMetricDTO;
import com.example.app.dto.HealthTrendDTO;
import com.example.app.service.HealthMetricService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health-metrics")
public class HealthMetricController {
    private final HealthMetricService healthMetricService;

    public HealthMetricController(HealthMetricService healthMetricService) {
        this.healthMetricService = healthMetricService;
    }

    @PostMapping
    public ResponseEntity<HealthMetricDTO> logMetric(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        LocalDate date = LocalDate.parse(request.get("date").toString());
        Integer caloriesIntake = request.get("caloriesIntake") != null ? 
                Integer.valueOf(request.get("caloriesIntake").toString()) : null;
        Integer exerciseMinutes = request.get("exerciseMinutes") != null ? 
                Integer.valueOf(request.get("exerciseMinutes").toString()) : null;
        Double weight = request.get("weight") != null ? 
                Double.valueOf(request.get("weight").toString()) : null;
        Integer sleepHours = request.get("sleepHours") != null ? 
                Integer.valueOf(request.get("sleepHours").toString()) : null;
        Integer waterIntake = request.get("waterIntake") != null ? 
                Integer.valueOf(request.get("waterIntake").toString()) : null;
        String symptoms = request.get("symptoms") != null ? 
                request.get("symptoms").toString() : null;
        
        HealthMetricDTO metric = HealthMetricDTO.fromEntity(
                healthMetricService.logMetric(userId, date, caloriesIntake, exerciseMinutes, 
                        weight, sleepHours, waterIntake, symptoms));
        return ResponseEntity.ok(metric);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HealthMetricDTO>> getUserMetrics(@PathVariable Long userId) {
        return ResponseEntity.ok(healthMetricService.getUserMetrics(userId));
    }

    @GetMapping("/user/{userId}/range")
    public ResponseEntity<List<HealthMetricDTO>> getUserMetricsInRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(healthMetricService.getUserMetricsInRange(userId, startDate, endDate));
    }



    @GetMapping("/user/{userId}/trends/weekly")
    public ResponseEntity<List<HealthTrendDTO>> getWeeklyTrends(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(healthMetricService.getWeeklyTrends(userId, startDate, endDate));
    }
}
