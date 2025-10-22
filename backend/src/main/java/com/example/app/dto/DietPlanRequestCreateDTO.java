package com.example.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class DietPlanRequestCreateDTO {
    @NotNull(message = "Age is required")
    @Positive(message = "Age must be positive")
    private Integer age;

    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    private Double weight;

    @NotNull(message = "Height is required")
    @Positive(message = "Height must be positive")
    private Double height;

    @NotBlank(message = "Dietary restrictions are required")
    private String dietaryRestrictions;

    @NotBlank(message = "Health goals are required")
    private String healthGoals;

    @NotBlank(message = "Activity level is required")
    private String activityLevel;

    public DietPlanRequestCreateDTO() {
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public String getDietaryRestrictions() {
        return dietaryRestrictions;
    }

    public void setDietaryRestrictions(String dietaryRestrictions) {
        this.dietaryRestrictions = dietaryRestrictions;
    }

    public String getHealthGoals() {
        return healthGoals;
    }

    public void setHealthGoals(String healthGoals) {
        this.healthGoals = healthGoals;
    }

    public String getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(String activityLevel) {
        this.activityLevel = activityLevel;
    }
}
