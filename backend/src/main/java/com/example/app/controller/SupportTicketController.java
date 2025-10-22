package com.example.app.controller;

import com.example.app.dto.SupportTicketDTO;
import com.example.app.dto.SupportTicketRequest;
import com.example.app.entity.SupportTicket;
import com.example.app.entity.User;
import com.example.app.service.SupportTicketService;
import com.example.app.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support-tickets")
public class SupportTicketController {
    private final SupportTicketService ticketService;
    private final AuthUtil authUtil;

    public SupportTicketController(SupportTicketService ticketService, AuthUtil authUtil) {
        this.ticketService = ticketService;
        this.authUtil = authUtil;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'DIETITIAN')")
    public ResponseEntity<SupportTicketDTO> createTicket(@Valid @RequestBody SupportTicketRequest request,
                                                         Authentication auth) {
        User user = authUtil.getAuthenticatedUser(auth);

        SupportTicketDTO dto = SupportTicketDTO.fromEntity(
                ticketService.createTicket(user.getId(), request.getSubject(), request.getDescription()));
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('SUPPORT_STAFF')")
    public ResponseEntity<SupportTicketDTO> acceptTicket(@PathVariable Long id, Authentication auth) {
        User user = authUtil.getAuthenticatedUser(auth);

        SupportTicketDTO dto = SupportTicketDTO.fromEntity(
                ticketService.acceptTicket(id, user.getId()));
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('SUPPORT_STAFF')")
    public ResponseEntity<Void> resolveTicket(@PathVariable Long id, Authentication auth) {
        User user = authUtil.getAuthenticatedUser(auth);
        
        ticketService.resolveTicket(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/queue")
    @PreAuthorize("hasRole('SUPPORT_STAFF')")
    public ResponseEntity<List<SupportTicketDTO>> getOpenTickets() {
        return ResponseEntity.ok(ticketService.getOpenTickets());
    }

    @GetMapping("/my-tickets")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'DIETITIAN', 'SUPPORT_STAFF')")
    public ResponseEntity<List<SupportTicketDTO>> getMyTickets(Authentication auth) {
        User user = authUtil.getAuthenticatedUser(auth);
        
        if (user.getRole() == User.Role.SUPPORT_STAFF) {
            return ResponseEntity.ok(ticketService.getStaffTickets(user.getId()));
        }
        return ResponseEntity.ok(ticketService.getPatientTickets(user.getId()));
    }

    @GetMapping("/{id}/chat-access")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'DIETITIAN', 'SUPPORT_STAFF')")
    public ResponseEntity<Map<String, Boolean>> checkChatAccess(@PathVariable Long id, Authentication auth) {
        User user = authUtil.getAuthenticatedUser(auth);
        
        SupportTicket ticket = ticketService.getTicketById(id);
        boolean hasAccess = ticket.getPatientId().equals(user.getId()) || 
                           (ticket.getAssignedStaffId() != null && ticket.getAssignedStaffId().equals(user.getId()));
        
        return ResponseEntity.ok(Map.of("hasAccess", hasAccess));
    }
}
