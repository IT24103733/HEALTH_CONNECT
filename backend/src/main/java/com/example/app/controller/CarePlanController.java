package com.example.app.controller;

import com.example.app.dto.CarePlanDTO;
import com.example.app.entity.CarePlan;
import com.example.app.service.CarePlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/care-plans")
public class CarePlanController {
    private final CarePlanService carePlanService;

    public CarePlanController(CarePlanService carePlanService) {
        this.carePlanService = carePlanService;
    }

    @PostMapping
    public ResponseEntity<CarePlanDTO> createCarePlan(@RequestBody Map<String, Object> request) {
        Long patientId = Long.valueOf(request.get("patientId").toString());
        Long creatorId = Long.valueOf(request.get("creatorId").toString());
        CarePlan.PlanType planType = CarePlan.PlanType.valueOf(request.get("planType").toString());
        String content = request.get("content").toString();
        
        CarePlanDTO plan = CarePlanDTO.fromEntity(
                carePlanService.createCarePlan(patientId, creatorId, planType, content));
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarePlanDTO> updateCarePlan(@PathVariable Long id, 
                                                      @RequestBody Map<String, String> request) {
        String content = request.get("content");
        CarePlanDTO plan = CarePlanDTO.fromEntity(carePlanService.updateCarePlan(id, content));
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
    public ResponseEntity<List<CarePlanDTO>> getPatientCarePlans(@PathVariable Long patientId) {
        return ResponseEntity.ok(carePlanService.getPatientCarePlans(patientId));
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<CarePlanDTO>> getCreatorCarePlans(@PathVariable Long creatorId) {
        return ResponseEntity.ok(carePlanService.getCreatorCarePlans(creatorId));
    }
}
