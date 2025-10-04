package com.example.app.dto;

import java.time.LocalDate;

public class HealthTrendDTO {
    private final LocalDate date;
    private final Double avgCalories;
    private final Double avgExercise;
    private final Double avgWeight;
    private final Double avgSleep;
    private final Double avgWater;
    private final Double avgHealthScore;

    public HealthTrendDTO(LocalDate date, Double avgCalories, Double avgExercise, 
                         Double avgWeight, Double avgSleep, Double avgWater, Double avgHealthScore) {
        this.date = date;
        this.avgCalories = avgCalories;
        this.avgExercise = avgExercise;
        this.avgWeight = avgWeight;
        this.avgSleep = avgSleep;
        this.avgWater = avgWater;
        this.avgHealthScore = avgHealthScore;
    }

    public LocalDate getDate() {
        return date;
    }

    public Double getAvgCalories() {
        return avgCalories;
    }

    public Double getAvgExercise() {
        return avgExercise;
    }

    public Double getAvgWeight() {
        return avgWeight;
    }

    public Double getAvgSleep() {
        return avgSleep;
    }

    public Double getAvgWater() {
        return avgWater;
    }

    public Double getAvgHealthScore() {
        return avgHealthScore;
    }
}
