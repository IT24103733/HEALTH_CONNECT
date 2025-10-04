package com.example.app.repository;

import com.example.app.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdOrderByScheduledTimeDesc(Long patientId);
    List<Appointment> findByClinicianIdOrderByScheduledTimeDesc(Long clinicianId);
    List<Appointment> findByClinicianIdAndScheduledTimeBetween(Long clinicianId, LocalDateTime start, LocalDateTime end);
}
