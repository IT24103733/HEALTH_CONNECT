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
                            "password123", User.Role.PATIENT, null));
            userService.findByEmail("physician@example.com")
                    .orElseGet(() -> userService.createUser("Dr. Smith", "physician@example.com", 
                            "password123", User.Role.DOCTOR, "Cardiology"));
            userService.findByEmail("dietitian@example.com")
                    .orElseGet(() -> userService.createUser("Jane Nutritionist", "dietitian@example.com", 
                            "password123", User.Role.DIETITIAN, "Clinical Nutrition"));
            userService.findByEmail("admin@example.com")
                    .orElseGet(() -> userService.createUser("Admin User", "admin@example.com", 
                            "password123", User.Role.SYSTEM_ADMIN, null));
            userService.findByEmail("superadmin@example.com")
                    .orElseGet(() -> userService.createUser("Super Admin", "superadmin@example.com", 
                            "password123", User.Role.SUPER_ADMIN, null));
            userService.findByEmail("support@example.com")
                    .orElseGet(() -> userService.createUser("Support Staff", "support@example.com", 
                            "password123", User.Role.SUPPORT_STAFF, null));

            System.out.println("Sample data seeded successfully!");
        };
    }
}
