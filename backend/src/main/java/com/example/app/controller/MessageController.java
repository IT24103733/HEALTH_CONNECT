package com.example.app.controller;

import com.example.app.dto.MessageDTO;
import com.example.app.dto.MessageRequest;
import com.example.app.entity.SupportTicket;
import com.example.app.entity.User;
import com.example.app.exception.UnauthorizedException;
import com.example.app.service.MessageService;
import com.example.app.service.SupportTicketService;
import com.example.app.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;
    private final SupportTicketService ticketService;
    private final AuthUtil authUtil;

    public MessageController(MessageService messageService, SupportTicketService ticketService, AuthUtil authUtil) {
        this.messageService = messageService;
        this.ticketService = ticketService;
        this.authUtil = authUtil;
    }

    @PostMapping("/ticket/{ticketId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'DIETITIAN', 'SUPPORT_STAFF')")
    public ResponseEntity<MessageDTO> sendTicketMessage(@PathVariable Long ticketId,
                                                        @Valid @RequestBody MessageRequest request,
                                                        Authentication auth) {
        User sender = authUtil.getAuthenticatedUser(auth);
        
        SupportTicket ticket = ticketService.getTicketById(ticketId);
        
        boolean hasAccess = ticket.getPatientId().equals(sender.getId()) || 
                           (ticket.getAssignedStaffId() != null && ticket.getAssignedStaffId().equals(sender.getId()));
        
        if (!hasAccess) {
            throw new UnauthorizedException("Unauthorized access to ticket chat");
        }
        
        Long recipientId = sender.getId().equals(ticket.getPatientId()) 
                ? ticket.getAssignedStaffId() 
                : ticket.getPatientId();
        
        MessageDTO message = MessageDTO.fromEntity(
                messageService.sendTicketMessage(sender.getId(), recipientId, 
                        request.getContent(), ticketId));
        return ResponseEntity.ok(message);
    }

    @GetMapping("/ticket/{ticketId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'DIETITIAN', 'SUPPORT_STAFF')")
    public ResponseEntity<List<MessageDTO>> getTicketMessages(@PathVariable Long ticketId, Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        
        SupportTicket ticket = ticketService.getTicketById(ticketId);
        
        boolean hasAccess = ticket.getPatientId().equals(currentUser.getId()) || 
                           (ticket.getAssignedStaffId() != null && ticket.getAssignedStaffId().equals(currentUser.getId()));
        
        if (!hasAccess) {
            throw new UnauthorizedException("Unauthorized access to ticket chat");
        }
        
        return ResponseEntity.ok(messageService.getTicketMessages(ticketId));
    }
}
