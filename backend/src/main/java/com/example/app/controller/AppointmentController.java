package com.example.app.controller;

import com.example.app.dto.AppointmentDTO;
import com.example.app.dto.UserDTO;
import com.example.app.entity.Appointment;
import com.example.app.entity.User;
import com.example.app.service.AppointmentService;
import com.example.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;
    private final UserService userService;

    public AppointmentController(AppointmentService appointmentService, UserService userService) {
        this.appointmentService = appointmentService;
        this.userService = userService;
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<UserDTO>> getAllDoctors(Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != User.Role.PATIENT) {
            throw new RuntimeException("Only patients can view doctors");
        }

        List<UserDTO> doctors = userService.findByRole(User.Role.PHYSICIAN).stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctors);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> scheduleAppointment(@RequestBody Map<String, Object> request,
                                                                    Authentication auth) {
        User patient = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (patient.getRole() != User.Role.PATIENT) {
            throw new RuntimeException("Only patients can book appointments");
        }

        Long clinicianId = Long.valueOf(request.get("clinicianId").toString());
        LocalDateTime scheduledTime = LocalDateTime.parse(request.get("scheduledTime").toString());
        String notes = request.get("notes") != null ? request.get("notes").toString() : null;
        
        User doctor = userService.findByRole(User.Role.PHYSICIAN).stream()
                .filter(d -> d.getId().equals(clinicianId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        appointmentService.scheduleAppointment(patient.getId(), clinicianId, scheduledTime, notes, doctor.getName());
        return ResponseEntity.ok(Map.of("message", "Doctor " + doctor.getName() + " successfully booked!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancelAppointment(@PathVariable Long id, Authentication auth) {
        User patient = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        appointmentService.cancelAppointment(id, patient.getId());
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(@PathVariable Long id, 
                                            @RequestBody Map<String, String> request,
                                            Authentication auth) {
        User doctor = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (doctor.getRole() != User.Role.PHYSICIAN) {
            throw new RuntimeException("Only doctors can update appointment status");
        }

        Appointment.AppointmentStatus status = Appointment.AppointmentStatus.valueOf(request.get("status"));
        appointmentService.updateAppointmentStatus(id, doctor.getId(), status);
        return ResponseEntity.ok(Map.of("message", "Appointment status updated"));
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<List<AppointmentDTO>> getMyAppointments(Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() == User.Role.PATIENT) {
            return ResponseEntity.ok(appointmentService.getPatientAppointments(user.getId()));
        } else if (user.getRole() == User.Role.PHYSICIAN) {
            return ResponseEntity.ok(appointmentService.getClinicianAppointments(user.getId()));
        }
        
        throw new RuntimeException("Unauthorized access");
    }

    @GetMapping("/check-conflict")
    public ResponseEntity<Map<String, Boolean>> checkConflict(
            @RequestParam Long clinicianId,
            @RequestParam String scheduledTime) {
        LocalDateTime time = LocalDateTime.parse(scheduledTime);
        boolean hasConflict = appointmentService.hasConflict(clinicianId, time);
        return ResponseEntity.ok(Map.of("hasConflict", hasConflict));
    }
}
