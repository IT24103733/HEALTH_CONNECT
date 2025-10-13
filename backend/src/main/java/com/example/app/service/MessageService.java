package com.example.app.service;

import com.example.app.dto.MessageDTO;
import com.example.app.entity.Message;
import com.example.app.repository.MessageRepository;
import com.example.app.util.HtmlSanitizer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final HtmlSanitizer htmlSanitizer;

    public MessageService(MessageRepository messageRepository, HtmlSanitizer htmlSanitizer) {
        this.messageRepository = messageRepository;
        this.htmlSanitizer = htmlSanitizer;
    }

    @Transactional
    public Message sendMessage(Long senderId, Long recipientId, String content) {
        String sanitizedContent = htmlSanitizer.sanitize(content);
        Message message = new Message(null, senderId, recipientId, sanitizedContent, LocalDateTime.now());
        return messageRepository.save(message);
    }

    @Transactional
    public Message sendTicketMessage(Long senderId, Long recipientId, String content, Long ticketId) {
        String sanitizedContent = htmlSanitizer.sanitize(content);
        Message message = new Message(null, senderId, recipientId, sanitizedContent, LocalDateTime.now());
        return messageRepository.save(message);
    }

    public List<MessageDTO> getInbox(Long userId) {
        return messageRepository.findByRecipientIdOrderByTimestampDesc(userId).stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MessageDTO> getSentMessages(Long userId) {
        return messageRepository.findBySenderIdOrderByTimestampDesc(userId).stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!message.getRecipientId().equals(userId)) {
            throw new RuntimeException("Cannot mark other users' messages as read");
        }
        
        message.setRead(true);
        messageRepository.save(message);
    }
}
