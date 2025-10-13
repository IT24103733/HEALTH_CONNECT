package com.example.app.controller;

import com.example.app.dto.CarePlanDTO;
import com.example.app.entity.CarePlan;
import com.example.app.entity.User;
import com.example.app.service.CarePlanService;
import com.example.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/care-plans")
public class CarePlanController {
    private final CarePlanService carePlanService;
    private final UserService userService;

    public CarePlanController(CarePlanService carePlanService, UserService userService) {
        this.carePlanService = carePlanService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<CarePlanDTO> createCarePlan(@RequestBody Map<String, Object> request, Authentication auth) {
        User currentUser = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Long patientId = Long.valueOf(request.get("patientId").toString());
        Long creatorId = Long.valueOf(request.get("creatorId").toString());
        CarePlan.PlanType planType = CarePlan.PlanType.valueOf(request.get("planType").toString());
        String content = request.get("content").toString();
        
        if (!currentUser.getId().equals(creatorId)) {
            throw new RuntimeException("Cannot create care plans for other users");
        }
        
        if (planType == CarePlan.PlanType.MEAL_PLAN && currentUser.getRole() != User.Role.DIETITIAN) {
            throw new RuntimeException("Only dietitians can create meal plans");
        }
        
        if (planType == CarePlan.PlanType.TREATMENT_PLAN && currentUser.getRole() != User.Role.DOCTOR) {
            throw new RuntimeException("Only doctors can create treatment plans");
        }
        
        CarePlanDTO plan = CarePlanDTO.fromEntity(
                carePlanService.createCarePlan(patientId, creatorId, planType, content));
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarePlanDTO> updateCarePlan(@PathVariable Long id, 
                                                      @RequestBody Map<String, String> request,
                                                      Authentication auth) {
        User currentUser = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String content = request.get("content");
        CarePlanDTO plan = CarePlanDTO.fromEntity(carePlanService.updateCarePlan(id, content, currentUser.getId()));
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{id}/adherence")
    public ResponseEntity<Void> updateAdherence(@PathVariable Long id, 
                                               @RequestBody Map<String, Double> request) {
        Double adherence = request.get("adherencePercentage");
        carePlanService.updateAdherence(id, adherence);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<CarePlanDTO>> getPatientCarePlans(@PathVariable Long patientId, Authentication auth) {
        User currentUser = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!currentUser.getId().equals(patientId) && 
            currentUser.getRole() != User.Role.DOCTOR && 
            currentUser.getRole() != User.Role.DIETITIAN) {
            throw new RuntimeException("Unauthorized access to care plans");
        }
        
        return ResponseEntity.ok(carePlanService.getPatientCarePlans(patientId));
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<CarePlanDTO>> getCreatorCarePlans(@PathVariable Long creatorId, Authentication auth) {
        User currentUser = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!currentUser.getId().equals(creatorId)) {
            throw new RuntimeException("Cannot access other users' created care plans");
        }
        
        return ResponseEntity.ok(carePlanService.getCreatorCarePlans(creatorId));
    }
}
