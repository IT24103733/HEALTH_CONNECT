package com.example.app.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public class HealthMetricRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @Positive(message = "Calories intake must be positive")
    private Integer caloriesIntake;

    @Positive(message = "Exercise minutes must be positive")
    private Integer exerciseMinutes;

    @Positive(message = "Weight must be positive")
    private Double weight;

    @Positive(message = "Sleep hours must be positive")
    private Integer sleepHours;

    @Positive(message = "Water intake must be positive")
    private Integer waterIntake;

    private String symptoms;

    public HealthMetricRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getCaloriesIntake() {
        return caloriesIntake;
    }

    public void setCaloriesIntake(Integer caloriesIntake) {
        this.caloriesIntake = caloriesIntake;
    }

    public Integer getExerciseMinutes() {
        return exerciseMinutes;
    }

    public void setExerciseMinutes(Integer exerciseMinutes) {
        this.exerciseMinutes = exerciseMinutes;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Integer getSleepHours() {
        return sleepHours;
    }

    public void setSleepHours(Integer sleepHours) {
        this.sleepHours = sleepHours;
    }

    public Integer getWaterIntake() {
        return waterIntake;
    }

    public void setWaterIntake(Integer waterIntake) {
        this.waterIntake = waterIntake;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }
}
