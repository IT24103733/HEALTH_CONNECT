package com.example.app;

import com.example.app.entity.User;
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
    public CommandLineRunner dataSeeder(UserService userService) {
        return args -> {
            userService.findByEmail("patient@example.com")
                    .orElseGet(() -> userService.createUser("John Doe", "patient@example.com", 
                            "password123", User.Role.PATIENT));
            userService.findByEmail("physician@example.com")
                    .orElseGet(() -> userService.createUser("Dr. Smith", "physician@example.com", 
                            "password123", User.Role.DOCTOR));
            userService.findByEmail("dietitian@example.com")
                    .orElseGet(() -> userService.createUser("Jane Nutritionist", "dietitian@example.com", 
                            "password123", User.Role.DIETITIAN));
            userService.findByEmail("admin@example.com")
                    .orElseGet(() -> userService.createUser("Admin User", "admin@example.com", 
                            "password123", User.Role.SYSTEM_ADMIN));
            userService.findByEmail("support@example.com")
                    .orElseGet(() -> userService.createUser("Support Staff", "support@example.com", 
                            "password123", User.Role.SUPPORT_STAFF));

            System.out.println("Sample data seeded successfully!");
        };
    }
}
