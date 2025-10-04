package com.example.app.controller;

import com.example.app.dto.MessageDTO;
import com.example.app.entity.SupportTicket;
import com.example.app.entity.User;
import com.example.app.service.MessageService;
import com.example.app.service.SupportTicketService;
import com.example.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;
    private final UserService userService;
    private final SupportTicketService ticketService;

    public MessageController(MessageService messageService, UserService userService, 
                           SupportTicketService ticketService) {
        this.messageService = messageService;
        this.userService = userService;
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody Map<String, Object> request, Authentication auth) {
        User sender = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Long recipientId = Long.valueOf(request.get("recipientId").toString());
        String content = request.get("content").toString();
        
        MessageDTO message = MessageDTO.fromEntity(
                messageService.sendMessage(sender.getId(), recipientId, content));
        return ResponseEntity.ok(message);
    }

    @PostMapping("/ticket/{ticketId}")
    public ResponseEntity<MessageDTO> sendTicketMessage(@PathVariable Long ticketId,
                                                        @RequestBody Map<String, Object> request,
                                                        Authentication auth) {
        User sender = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SupportTicket ticket = ticketService.getTicketById(ticketId);
        
        boolean hasAccess = ticket.getPatientId().equals(sender.getId()) || 
                           (ticket.getAssignedStaffId() != null && ticket.getAssignedStaffId().equals(sender.getId()));
        
        if (!hasAccess) {
            throw new RuntimeException("Unauthorized access to ticket chat");
        }
        
        Long recipientId = Long.valueOf(request.get("recipientId").toString());
        String content = request.get("content").toString();
        
        MessageDTO message = MessageDTO.fromEntity(
                messageService.sendTicketMessage(sender.getId(), recipientId, content, ticketId));
        return ResponseEntity.ok(message);
    }

    @GetMapping("/inbox/{userId}")
    public ResponseEntity<List<MessageDTO>> getInbox(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getInbox(userId));
    }

    @GetMapping("/sent/{userId}")
    public ResponseEntity<List<MessageDTO>> getSentMessages(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getSentMessages(userId));
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long messageId) {
        messageService.markAsRead(messageId);
        return ResponseEntity.ok().build();
    }
}
