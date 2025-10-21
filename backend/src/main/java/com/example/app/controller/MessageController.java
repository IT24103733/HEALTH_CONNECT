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

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageDTO> sendMessage(@Valid @RequestBody MessageRequest request, Authentication auth) {
        User sender = authUtil.getAuthenticatedUser(auth);
        
        MessageDTO message = MessageDTO.fromEntity(
                messageService.sendMessage(sender.getId(), request.getRecipientId(), request.getContent()));
        return ResponseEntity.ok(message);
    }

    @PostMapping("/ticket/{ticketId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'SUPPORT_STAFF')")
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
        
        MessageDTO message = MessageDTO.fromEntity(
                messageService.sendTicketMessage(sender.getId(), request.getRecipientId(), 
                        request.getContent(), ticketId));
        return ResponseEntity.ok(message);
    }

    @GetMapping("/inbox/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageDTO>> getInbox(@PathVariable Long userId, Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("Cannot access other users' inbox");
        }
        
        return ResponseEntity.ok(messageService.getInbox(userId));
    }

    @GetMapping("/sent/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageDTO>> getSentMessages(@PathVariable Long userId, Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("Cannot access other users' sent messages");
        }
        
        return ResponseEntity.ok(messageService.getSentMessages(userId));
    }

    @PutMapping("/{messageId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(@PathVariable Long messageId, Authentication auth) {
        User currentUser = authUtil.getAuthenticatedUser(auth);
        
        messageService.markAsRead(messageId, currentUser.getId());
        return ResponseEntity.ok().build();
    }
}
