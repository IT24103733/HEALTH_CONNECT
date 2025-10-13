package com.example.app;

import com.example.app.entity.User;
import com.example.app.service.MessageService;
import com.example.app.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public CommandLineRunner dataSeeder(UserService userService, MessageService messageService) {
        return args -> {
            User patient = userService.findByEmail("patient@example.com")
                    .orElseGet(() -> userService.createUser("John Doe", "patient@example.com", 
                            "password123", User.Role.PATIENT));
            User physician = userService.findByEmail("physician@example.com")
                    .orElseGet(() -> userService.createUser("Dr. Smith", "physician@example.com", 
                            "password123", User.Role.DOCTOR));
            User dietitian = userService.findByEmail("dietitian@example.com")
                    .orElseGet(() -> userService.createUser("Jane Nutritionist", "dietitian@example.com", 
                            "password123", User.Role.DIETITIAN));
            User admin = userService.findByEmail("admin@example.com")
                    .orElseGet(() -> userService.createUser("Admin User", "admin@example.com", 
                            "password123", User.Role.SYSTEM_ADMIN));

            messageService.sendMessage(physician.getId(), patient.getId(), 
                    "Welcome to Health Connect! Please log your daily health metrics.");
            messageService.sendMessage(dietitian.getId(), patient.getId(), 
                    "I've created a personalized meal plan for you. Check your care plans.");

            System.out.println("Sample data seeded successfully!");
        };
    }
}
