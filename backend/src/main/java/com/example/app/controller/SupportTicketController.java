package com.example.app.controller;

import com.example.app.dto.SupportTicketDTO;
import com.example.app.entity.SupportTicket;
import com.example.app.entity.User;
import com.example.app.service.SupportTicketService;
import com.example.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support-tickets")
public class SupportTicketController {
    private final SupportTicketService ticketService;
    private final UserService userService;

    public SupportTicketController(SupportTicketService ticketService, UserService userService) {
        this.ticketService = ticketService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<SupportTicketDTO> createTicket(@RequestBody Map<String, String> request,
                                                         Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != User.Role.PATIENT) {
            throw new RuntimeException("Only patients can create tickets");
        }

        String subject = request.get("subject");
        String description = request.get("description");

        SupportTicketDTO dto = SupportTicketDTO.fromEntity(
                ticketService.createTicket(user.getId(), subject, description));
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<SupportTicketDTO> acceptTicket(@PathVariable Long id, Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != User.Role.SUPPORT_STAFF) {
            throw new RuntimeException("Only support staff can accept tickets");
        }

        SupportTicketDTO dto = SupportTicketDTO.fromEntity(
                ticketService.acceptTicket(id, user.getId()));
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Void> resolveTicket(@PathVariable Long id, Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ticketService.resolveTicket(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/queue")
    public ResponseEntity<List<SupportTicketDTO>> getOpenTickets(Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != User.Role.SUPPORT_STAFF) {
            throw new RuntimeException("Only support staff can view queue");
        }

        return ResponseEntity.ok(ticketService.getOpenTickets());
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<List<SupportTicketDTO>> getMyTickets(Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() == User.Role.PATIENT) {
            return ResponseEntity.ok(ticketService.getPatientTickets(user.getId()));
        } else if (user.getRole() == User.Role.SUPPORT_STAFF) {
            return ResponseEntity.ok(ticketService.getStaffTickets(user.getId()));
        }
        
        throw new RuntimeException("Unauthorized access");
    }

    @GetMapping("/{id}/chat-access")
    public ResponseEntity<Map<String, Boolean>> checkChatAccess(@PathVariable Long id, Authentication auth) {
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SupportTicket ticket = ticketService.getTicketById(id);
        boolean hasAccess = ticket.getPatientId().equals(user.getId()) || 
                           (ticket.getAssignedStaffId() != null && ticket.getAssignedStaffId().equals(user.getId()));
        
        return ResponseEntity.ok(Map.of("hasAccess", hasAccess));
    }
}
