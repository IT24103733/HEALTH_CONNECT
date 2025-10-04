package com.example.app.service;

import com.example.app.dto.HealthMetricDTO;
import com.example.app.entity.HealthMetric;
import com.example.app.repository.HealthMetricRepository;
import com.example.app.util.HealthScoreCalculator;
import com.example.app.util.HtmlSanitizer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthMetricService {
    private final HealthMetricRepository healthMetricRepository;
    private final HealthScoreCalculator healthScoreCalculator;
    private final HtmlSanitizer htmlSanitizer;

    public HealthMetricService(HealthMetricRepository healthMetricRepository,
                              HealthScoreCalculator healthScoreCalculator,
                              HtmlSanitizer htmlSanitizer) {
        this.healthMetricRepository = healthMetricRepository;
        this.healthScoreCalculator = healthScoreCalculator;
        this.htmlSanitizer = htmlSanitizer;
    }

    @Transactional
    public HealthMetric logMetric(Long userId, LocalDate date, Integer caloriesIntake,
                                 Integer exerciseMinutes, Double weight, Integer sleepHours,
                                 Integer waterIntake, String symptoms) {
        String sanitizedSymptoms = htmlSanitizer.sanitize(symptoms);
        
        HealthMetric metric = new HealthMetric(null, userId, date, caloriesIntake,
                exerciseMinutes, weight, sleepHours, waterIntake, sanitizedSymptoms, 0);
        
        List<HealthMetric> recentMetrics = List.of(metric);
        int score = healthScoreCalculator.predictScore(recentMetrics);
        metric.setHealthScore(score);
        
        return healthMetricRepository.save(metric);
    }

    public List<HealthMetricDTO> getUserMetrics(Long userId) {
        return healthMetricRepository.findByUserIdOrderByDateDesc(userId).stream()
                .map(HealthMetricDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<HealthMetricDTO> getUserMetricsInRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return healthMetricRepository.findByUserIdAndDateBetween(userId, startDate, endDate).stream()
                .map(HealthMetricDTO::fromEntity)
                .collect(Collectors.toList());
    }



    public List<com.example.app.dto.HealthTrendDTO> getWeeklyTrends(Long userId, LocalDate startDate, LocalDate endDate) {
        List<HealthMetric> metrics = healthMetricRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        return metrics.stream()
                .collect(Collectors.groupingBy(m -> m.getDate().minusDays(m.getDate().getDayOfWeek().getValue() - 1)))
                .entrySet().stream()
                .map(entry -> {
                    List<HealthMetric> weekMetrics = entry.getValue();
                    return new com.example.app.dto.HealthTrendDTO(
                            entry.getKey(),
                            weekMetrics.stream().filter(m -> m.getCaloriesIntake() != null)
                                    .mapToDouble(m -> m.getCaloriesIntake().doubleValue()).average().orElse(0),
                            weekMetrics.stream().filter(m -> m.getExerciseMinutes() != null)
                                    .mapToDouble(m -> m.getExerciseMinutes().doubleValue()).average().orElse(0),
                            weekMetrics.stream().filter(m -> m.getWeight() != null)
                                    .mapToDouble(HealthMetric::getWeight).average().orElse(0),
                            weekMetrics.stream().filter(m -> m.getSleepHours() != null)
                                    .mapToDouble(m -> m.getSleepHours().doubleValue()).average().orElse(0),
                            weekMetrics.stream().filter(m -> m.getWaterIntake() != null)
                                    .mapToDouble(m -> m.getWaterIntake().doubleValue()).average().orElse(0),
                            weekMetrics.stream().mapToDouble(m -> m.getHealthScore().doubleValue()).average().orElse(0)
                    );
                })
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());
    }
}
