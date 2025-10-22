package com.example.app.controller;

import com.example.app.dto.DietPlanRequestCreateDTO;
import com.example.app.dto.DietPlanRequestDTO;
import com.example.app.dto.DietPlanRequestUpdateDTO;
import com.example.app.entity.User;
import com.example.app.exception.UnauthorizedException;
import com.example.app.service.DietPlanRequestService;
import com.example.app.service.UserService;
import com.example.app.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/diet-requests")
public class DietPlanRequestController {
    private final DietPlanRequestService requestService;
    private final AuthUtil authUtil;

    public DietPlanRequestController(DietPlanRequestService requestService, AuthUtil authUtil) {
        this.requestService = requestService;
        this.authUtil = authUtil;
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<DietPlanRequestDTO> createRequest(@Valid @RequestBody DietPlanRequestCreateDTO request,
                                                            Authentication auth) {
        User user = authUtil.getAuthenticatedUser(auth);

        DietPlanRequestDTO dto = DietPlanRequestDTO.fromEntity(
                requestService.createRequest(user.getId(), request.getAge(), request.getWeight(), 
                        request.getHeight(), request.getDietaryRestrictions(), 
                        request.getHealthGoals(), request.getActivityLevel()));
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<DietPlanRequestDTO> updateRequest(@PathVariable Long id,
                                                            @Valid @RequestBody DietPlanRequestUpdateDTO request,
                                                            Authentication auth) {
        User user = authUtil.getAuthenticatedUser(auth);

        DietPlanRequestDTO dto = DietPlanRequestDTO.fromEntity(
                requestService.updateRequest(id, user.getId(), request.getWeight(), request.getHeight(),
                        request.getDietaryRestrictions(), request.getHealthGoals(), request.getActivityLevel()));
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id, Authentication auth) {
        User user = authUtil.getAuthenticatedUser(auth);
        
        requestService.deleteRequest(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ResponseEntity<DietPlanRequestDTO> acceptRequest(@PathVariable Long id, Authentication auth) {
        User user = authUtil.getAuthenticatedUser(auth);

        DietPlanRequestDTO dto = DietPlanRequestDTO.fromEntity(
                requestService.acceptRequest(id, user.getId()));
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/queue")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ResponseEntity<List<DietPlanRequestDTO>> getPendingRequests() {
        return ResponseEntity.ok(requestService.getPendingRequests());
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasAnyRole('PATIENT', 'DIETITIAN')")
    public ResponseEntity<List<DietPlanRequestDTO>> getMyRequests(Authentication auth) {
        User user = authUtil.getAuthenticatedUser(auth);
        
        if (user.getRole() == User.Role.PATIENT) {
            return ResponseEntity.ok(requestService.getPatientRequests(user.getId()));
        }
        return ResponseEntity.ok(requestService.getDieticianRequests(user.getId()));
    }

    @GetMapping("/accepted-patients")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ResponseEntity<List<Map<String, Object>>> getAcceptedPatients(Authentication auth) {
        User dietitian = authUtil.getAuthenticatedUser(auth);
        
        List<DietPlanRequestDTO> acceptedRequests = requestService.getDieticianRequests(dietitian.getId())
            .stream()
            .filter(req -> "ACCEPTED".equals(req.getStatus()))
            .collect(Collectors.toList());
        
        List<Map<String, Object>> patients = acceptedRequests.stream()
            .collect(Collectors.groupingBy(DietPlanRequestDTO::getPatientId))
            .entrySet()
            .stream()
            .map(entry -> {
                Long patientId = entry.getKey();
                DietPlanRequestDTO request = entry.getValue().get(0);
                
                Map<String, Object> patientInfo = new HashMap<>();
                patientInfo.put("id", patientId);
                patientInfo.put("age", request.getAge());
                patientInfo.put("weight", request.getWeight());
                patientInfo.put("height", request.getHeight());
                patientInfo.put("dietaryRestrictions", request.getDietaryRestrictions());
                patientInfo.put("healthGoals", request.getHealthGoals());
                patientInfo.put("activityLevel", request.getActivityLevel());
                
                return patientInfo;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(patients);
    }
}
