package com.example.app.dto;

import com.example.app.entity.HealthMetric;
import java.time.LocalDate;

public class HealthMetricDTO {
    private final Long id;
    private final Long userId;
    private final LocalDate date;
    private final Integer caloriesIntake;
    private final Integer exerciseMinutes;
    private final Double weight;
    private final Integer sleepHours;
    private final Integer waterIntake;
    private final String symptoms;
    private final Integer healthScore;

    public HealthMetricDTO(Long id, Long userId, LocalDate date, Integer caloriesIntake,
                          Integer exerciseMinutes, Double weight, Integer sleepHours,
                          Integer waterIntake, String symptoms, Integer healthScore) {
        this.id = id;
        this.userId = userId;
        this.date = date;
        this.caloriesIntake = caloriesIntake;
        this.exerciseMinutes = exerciseMinutes;
        this.weight = weight;
        this.sleepHours = sleepHours;
        this.waterIntake = waterIntake;
        this.symptoms = symptoms;
        this.healthScore = healthScore;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public Integer getCaloriesIntake() {
        return caloriesIntake;
    }

    public Integer getExerciseMinutes() {
        return exerciseMinutes;
    }

    public Double getWeight() {
        return weight;
    }

    public Integer getSleepHours() {
        return sleepHours;
    }

    public Integer getWaterIntake() {
        return waterIntake;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public Integer getHealthScore() {
        return healthScore;
    }

    public static HealthMetricDTO fromEntity(HealthMetric metric) {
        return new HealthMetricDTO(metric.getId(), metric.getUserId(), metric.getDate(),
                                  metric.getCaloriesIntake(), metric.getExerciseMinutes(),
                                  metric.getWeight(), metric.getSleepHours(), metric.getWaterIntake(),
                                  metric.getSymptoms(), metric.getHealthScore());
    }
}
