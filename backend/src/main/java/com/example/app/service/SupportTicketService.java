package com.example.app.service;

import com.example.app.dto.SupportTicketDTO;
import com.example.app.entity.SupportTicket;
import com.example.app.repository.SupportTicketRepository;
import com.example.app.util.HtmlSanitizer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupportTicketService {
    private final SupportTicketRepository ticketRepository;
    private final HtmlSanitizer htmlSanitizer;

    public SupportTicketService(SupportTicketRepository ticketRepository, HtmlSanitizer htmlSanitizer) {
        this.ticketRepository = ticketRepository;
        this.htmlSanitizer = htmlSanitizer;
    }

    @Transactional
    public SupportTicket createTicket(Long patientId, String subject, String description) {
        String sanitizedSubject = htmlSanitizer.sanitize(subject);
        String sanitizedDescription = htmlSanitizer.sanitize(description);

        SupportTicket ticket = new SupportTicket(null, patientId, sanitizedSubject, sanitizedDescription,
                SupportTicket.TicketStatus.OPEN, null, LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    @Transactional
    public SupportTicket acceptTicket(Long ticketId, Long staffId) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        if (ticket.getStatus() != SupportTicket.TicketStatus.OPEN) {
            throw new RuntimeException("Ticket already assigned");
        }

        ticket.setStatus(SupportTicket.TicketStatus.ASSIGNED);
        ticket.setAssignedStaffId(staffId);
        return ticketRepository.save(ticket);
    }

    @Transactional
    public void resolveTicket(Long ticketId, Long staffId) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        if (!ticket.getAssignedStaffId().equals(staffId)) {
            throw new RuntimeException("Unauthorized access");
        }

        ticket.setStatus(SupportTicket.TicketStatus.RESOLVED);
        ticketRepository.save(ticket);
    }

    public List<SupportTicketDTO> getOpenTickets() {
        return ticketRepository.findByStatus(SupportTicket.TicketStatus.OPEN).stream()
                .map(SupportTicketDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<SupportTicketDTO> getStaffTickets(Long staffId) {
        return ticketRepository.findByAssignedStaffId(staffId).stream()
                .map(SupportTicketDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<SupportTicketDTO> getPatientTickets(Long patientId) {
        return ticketRepository.findByPatientId(patientId).stream()
                .map(SupportTicketDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public SupportTicket getTicketById(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
}
