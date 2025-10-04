package com.example.app.util;

import com.example.app.entity.HealthMetric;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class HealthScoreCalculator {
    
    public int predictScore(List<HealthMetric> metrics) {
        if (metrics == null || metrics.isEmpty()) {
            return 50;
        }
        
        HealthMetric latest = metrics.get(0);
        int score = 0;
        int factors = 0;
        
        if (latest.getCaloriesIntake() != null) {
            score += calculateCalorieScore(latest.getCaloriesIntake());
            factors++;
        }
        
        if (latest.getExerciseMinutes() != null) {
            score += calculateExerciseScore(latest.getExerciseMinutes());
            factors++;
        }
        
        if (latest.getSleepHours() != null) {
            score += calculateSleepScore(latest.getSleepHours());
            factors++;
        }
        
        if (latest.getWaterIntake() != null) {
            score += calculateWaterScore(latest.getWaterIntake());
            factors++;
        }
        
        if (latest.getSymptoms() != null && !latest.getSymptoms().isEmpty()) {
            score -= 10;
            factors++;
        }
        
        return factors > 0 ? Math.max(0, Math.min(100, score / factors)) : 50;
    }
    
    private int calculateCalorieScore(int calories) {
        if (calories >= 1800 && calories <= 2500) return 100;
        if (calories >= 1500 && calories <= 3000) return 75;
        if (calories >= 1200 && calories <= 3500) return 50;
        return 25;
    }
    
    private int calculateExerciseScore(int minutes) {
        if (minutes >= 30 && minutes <= 90) return 100;
        if (minutes >= 15 && minutes <= 120) return 75;
        if (minutes > 0 && minutes <= 150) return 50;
        return 25;
    }
    
    private int calculateSleepScore(int hours) {
        if (hours >= 7 && hours <= 9) return 100;
        if (hours >= 6 && hours <= 10) return 75;
        if (hours >= 5 && hours <= 11) return 50;
        return 25;
    }
    
    private int calculateWaterScore(int ml) {
        if (ml >= 2000 && ml <= 3000) return 100;
        if (ml >= 1500 && ml <= 3500) return 75;
        if (ml >= 1000 && ml <= 4000) return 50;
        return 25;
    }
}
