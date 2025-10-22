package com.example.app.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "health_metrics", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userId", "date"})
})
public class HealthMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDate date;

    private Integer caloriesIntake;
    private Integer exerciseMinutes;
    private Double weight;
    private Integer sleepHours;
    private Integer waterIntake;
    private String symptoms;

    @Column(nullable = false)
    private Integer healthScore;

    protected HealthMetric() {}

    public HealthMetric(Long id, Long userId, LocalDate date, Integer caloriesIntake, 
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

    public void setHealthScore(Integer healthScore) {
        this.healthScore = healthScore;
    }

    public void setCaloriesIntake(Integer caloriesIntake) {
        this.caloriesIntake = caloriesIntake;
    }

    public void setExerciseMinutes(Integer exerciseMinutes) {
        this.exerciseMinutes = exerciseMinutes;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public void setSleepHours(Integer sleepHours) {
        this.sleepHours = sleepHours;
    }

    public void setWaterIntake(Integer waterIntake) {
        this.waterIntake = waterIntake;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }
}
