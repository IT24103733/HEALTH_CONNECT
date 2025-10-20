package com.example.app.service;

import com.example.app.dto.AppointmentDTO;
import com.example.app.entity.Appointment;
import com.example.app.repository.AppointmentRepository;
import com.example.app.util.HtmlSanitizer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final HtmlSanitizer htmlSanitizer;

    public AppointmentService(AppointmentRepository appointmentRepository, HtmlSanitizer htmlSanitizer) {
        this.appointmentRepository = appointmentRepository;
        this.htmlSanitizer = htmlSanitizer;
    }

    @Transactional
    public Appointment scheduleAppointment(Long patientId, Long clinicianId, 
                                          LocalDateTime scheduledTime, String notes, String doctorName) {
        if (hasConflict(clinicianId, scheduledTime)) {
            throw new RuntimeException("Time slot conflict detected");
        }
        
        String sanitizedNotes = htmlSanitizer.sanitize(notes);
        Appointment appointment = new Appointment(null, patientId, clinicianId, 
                                                  scheduledTime, Appointment.AppointmentStatus.SCHEDULED, 
                                                  sanitizedNotes);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public void cancelAppointment(Long appointmentId, Long patientId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        if (!appointment.getPatientId().equals(patientId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public void updateAppointmentStatus(Long appointmentId, Long clinicianId, Appointment.AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        if (!appointment.getClinicianId().equals(clinicianId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        appointment.setStatus(status);
        appointmentRepository.save(appointment);
    }

    public boolean hasConflict(Long clinicianId, LocalDateTime scheduledTime) {
        LocalDateTime start = scheduledTime.minusMinutes(30);
        LocalDateTime end = scheduledTime.plusMinutes(30);
        List<Appointment> conflicts = appointmentRepository
                .findByClinicianIdAndScheduledTimeBetween(clinicianId, start, end);
        return conflicts.stream()
                .anyMatch(apt -> apt.getStatus() == Appointment.AppointmentStatus.SCHEDULED);
    }

    @Transactional
    public void updateStatus(Long id, Appointment.AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        appointmentRepository.save(appointment);
    }

    public List<AppointmentDTO> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByScheduledTimeDesc(patientId).stream()
                .map(AppointmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getClinicianAppointments(Long clinicianId) {
        return appointmentRepository.findByClinicianIdOrderByScheduledTimeDesc(clinicianId).stream()
                .map(AppointmentDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
