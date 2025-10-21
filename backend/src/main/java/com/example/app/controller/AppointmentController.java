package com.example.app.controller;

import com.example.app.dto.AppointmentDTO;
import com.example.app.dto.AppointmentRequest;
import com.example.app.dto.UpdateStatusRequest;
import com.example.app.dto.UserDTO;
import com.example.app.entity.Appointment;
import com.example.app.entity.User;
import com.example.app.exception.NotFoundException;
import com.example.app.exception.ValidationException;
import com.example.app.service.AppointmentService;
import com.example.app.service.UserService;
import com.example.app.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;
    private final UserService userService;
    private final AuthUtil authUtil;

    public AppointmentController(AppointmentService appointmentService, UserService userService, AuthUtil authUtil) {
        this.appointmentService = appointmentService;
        this.userService = userService;
        this.authUtil = authUtil;
    }

    @GetMapping("/doctors")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<UserDTO>> getAllDoctors() {
        List<UserDTO> clinicians = Stream.concat(
                userService.findByRole(User.Role.DOCTOR).stream(),
                userService.findByRole(User.Role.DIETITIAN).stream()
        )
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clinicians);
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Map<String, String>> scheduleAppointment(@Valid @RequestBody AppointmentRequest request,
                                                                    Authentication auth) {
        User patient = authUtil.getAuthenticatedUser(auth);
        
        User clinician = userService.findById(request.getClinicianId())
                .orElseThrow(() -> new NotFoundException("Clinician not found"));
        
        if (clinician.getRole() != User.Role.DOCTOR && clinician.getRole() != User.Role.DIETITIAN) {
            throw new ValidationException("Can only book appointments with doctors or dietitians");
        }
        
        appointmentService.scheduleAppointment(patient.getId(), request.getClinicianId(), 
                request.getScheduledTime(), request.getNotes(), clinician.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Appointment with " + clinician.getName() + " successfully booked!"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Map<String, String>> cancelAppointment(@PathVariable Long id, Authentication auth) {
        User patient = authUtil.getAuthenticatedUser(auth);
        
        appointmentService.cancelAppointment(id, patient.getId());
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully"));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DOCTOR', 'DIETITIAN')")
    public ResponseEntity<Map<String, String>> updateStatus(@PathVariable Long id, 
                                            @Valid @RequestBody UpdateStatusRequest request,
                                            Authentication auth) {
        User clinician = authUtil.getAuthenticatedUser(auth);

        Appointment.AppointmentStatus status;
        try {
            status = Appointment.AppointmentStatus.valueOf(request.getStatus());
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid status value");
        }
        
        appointmentService.updateAppointmentStatus(id, clinician.getId(), status);
        return ResponseEntity.ok(Map.of("message", "Appointment status updated"));
    }

    @GetMapping("/my-appointments")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'DIETITIAN')")
    public ResponseEntity<List<AppointmentDTO>> getMyAppointments(Authentication auth) {
        User user = authUtil.getAuthenticatedUser(auth);
        
        if (user.getRole() == User.Role.PATIENT) {
            return ResponseEntity.ok(appointmentService.getPatientAppointments(user.getId()));
        }
        return ResponseEntity.ok(appointmentService.getClinicianAppointments(user.getId()));
    }

    @GetMapping("/check-conflict")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Map<String, Boolean>> checkConflict(
            @RequestParam Long clinicianId,
            @RequestParam String scheduledTime) {
        LocalDateTime time;
        try {
            time = LocalDateTime.parse(scheduledTime);
        } catch (DateTimeParseException e) {
            throw new ValidationException("Invalid date/time format");
        }
        
        boolean hasConflict = appointmentService.hasConflict(clinicianId, time);
        return ResponseEntity.ok(Map.of("hasConflict", hasConflict));
    }
}
