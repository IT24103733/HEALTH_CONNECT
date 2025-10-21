package com.example.app.controller;

import com.example.app.dto.CarePlanDTO;
import com.example.app.dto.CarePlanRequest;
import com.example.app.entity.CarePlan;
import com.example.app.entity.User;
import com.example.app.exception.UnauthorizedException;
import com.example.app.exception.ValidationException;
import com.example.app.service.CarePlanService;
import com.example.app.service.UserService;
import com.example.app.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/care-plans")
public class CarePlanController {
    private final CarePlanService carePlanService;
    private final UserService userService;
    private final AuthUtil authUtil;

    public CarePlanController(CarePlanService carePlanService, UserService userService, AuthUtil authUtil) {
        this.carePlanService = carePlanService;
        this.userService = userService;
        this.authUtil = authUtil;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DIETITIAN', 'DOCTOR')")
    public ResponseEntity<CarePlanDTO> createCarePlan(@Valid @RequestBody CarePlanRequest request, Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        
        if (!currentUser.getId().equals(request.getCreatorId())) {
            throw new ValidationException("Cannot create care plans for other users");
        }
        
        CarePlan.PlanType planType;
        try {
            planType = CarePlan.PlanType.valueOf(request.getPlanType());
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid plan type");
        }
        
        if (planType == CarePlan.PlanType.MEAL_PLAN && currentUser.getRole() != User.Role.DIETITIAN) {
            throw new UnauthorizedException("Only dietitians can create meal plans");
        }
        
        if (planType == CarePlan.PlanType.TREATMENT_PLAN && currentUser.getRole() != User.Role.DOCTOR) {
            throw new UnauthorizedException("Only doctors can create treatment plans");
        }
        
        CarePlanDTO plan = CarePlanDTO.fromEntity(
                carePlanService.createCarePlan(request.getPatientId(), request.getCreatorId(), 
                        planType, request.getContent()));
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'DOCTOR')")
    public ResponseEntity<CarePlanDTO> updateCarePlan(@PathVariable Long id, 
                                                      @RequestBody Map<String, String> request,
                                                      Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        
        String content = request.get("content");
        CarePlanDTO plan = CarePlanDTO.fromEntity(carePlanService.updateCarePlan(id, content, currentUser.getId()));
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{id}/adherence")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<Void> updateAdherence(@PathVariable Long id, 
                                               @RequestBody Map<String, Double> request) {
        Double adherence = request.get("adherencePercentage");
        carePlanService.updateAdherence(id, adherence);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'DIETITIAN')")
    public ResponseEntity<List<CarePlanDTO>> getPatientCarePlans(@PathVariable Long patientId, Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        
        if (!currentUser.getId().equals(patientId) && 
            currentUser.getRole() != User.Role.DOCTOR && 
            currentUser.getRole() != User.Role.DIETITIAN) {
            throw new UnauthorizedException("Unauthorized access to care plans");
        }
        
        return ResponseEntity.ok(carePlanService.getPatientCarePlans(patientId));
    }

    @GetMapping("/creator/{creatorId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'DIETITIAN')")
    public ResponseEntity<List<CarePlanDTO>> getCreatorCarePlans(@PathVariable Long creatorId, Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        
        if (!currentUser.getId().equals(creatorId)) {
            throw new UnauthorizedException("Cannot access other users' created care plans");
        }
        
        return ResponseEntity.ok(carePlanService.getCreatorCarePlans(creatorId));
    }
}
