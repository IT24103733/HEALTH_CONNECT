package com.example.app.controller;

import com.example.app.dto.DietPlanRequestDTO;
import com.example.app.entity.User;
import com.example.app.service.DietPlanRequestService;
import com.example.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diet-requests")
public class DietPlanRequestController {
    private final DietPlanRequestService requestService;
    private final UserService userService;

    public DietPlanRequestController(DietPlanRequestService requestService, UserService userService) {
        this.requestService = requestService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<DietPlanRequestDTO> createRequest(@RequestBody Map<String, Object> request,
                                                            Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != User.Role.PATIENT) {
            throw new RuntimeException("Only patients can create diet requests");
        }

        Integer age = Integer.valueOf(request.get("age").toString());
        Double weight = Double.valueOf(request.get("weight").toString());
        Double height = Double.valueOf(request.get("height").toString());
        String dietaryRestrictions = request.get("dietaryRestrictions").toString();
        String healthGoals = request.get("healthGoals").toString();
        String activityLevel = request.get("activityLevel").toString();

        DietPlanRequestDTO dto = DietPlanRequestDTO.fromEntity(
                requestService.createRequest(user.getId(), age, weight, height,
                        dietaryRestrictions, healthGoals, activityLevel));
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DietPlanRequestDTO> updateRequest(@PathVariable Long id,
                                                            @RequestBody Map<String, Object> request,
                                                            Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Double weight = Double.valueOf(request.get("weight").toString());
        Double height = Double.valueOf(request.get("height").toString());
        String dietaryRestrictions = request.get("dietaryRestrictions").toString();
        String healthGoals = request.get("healthGoals").toString();
        String activityLevel = request.get("activityLevel").toString();

        DietPlanRequestDTO dto = DietPlanRequestDTO.fromEntity(
                requestService.updateRequest(id, user.getId(), weight, height,
                        dietaryRestrictions, healthGoals, activityLevel));
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id, Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        requestService.deleteRequest(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<DietPlanRequestDTO> acceptRequest(@PathVariable Long id, Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != User.Role.DIETITIAN) {
            throw new RuntimeException("Only dietitians can accept requests");
        }

        DietPlanRequestDTO dto = DietPlanRequestDTO.fromEntity(
                requestService.acceptRequest(id, user.getId()));
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/queue")
    public ResponseEntity<List<DietPlanRequestDTO>> getPendingRequests(Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != User.Role.DIETITIAN) {
            throw new RuntimeException("Only dietitians can view queue");
        }

        return ResponseEntity.ok(requestService.getPendingRequests());
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<DietPlanRequestDTO>> getMyRequests(Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() == User.Role.PATIENT) {
            return ResponseEntity.ok(requestService.getPatientRequests(user.getId()));
        } else if (user.getRole() == User.Role.DIETITIAN) {
            return ResponseEntity.ok(requestService.getDieticianRequests(user.getId()));
        }
        
        throw new RuntimeException("Unauthorized access");
    }
}
