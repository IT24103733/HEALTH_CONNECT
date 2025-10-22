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
    public Message sendTicketMessage(Long senderId, Long recipientId, String content, Long ticketId) {
        String sanitizedContent = htmlSanitizer.sanitize(content);
        Message message = new Message(null, senderId, recipientId, sanitizedContent, LocalDateTime.now(), ticketId);
        return messageRepository.save(message);
    }

    public List<MessageDTO> getTicketMessages(Long ticketId) {
        return messageRepository.findByTicketIdOrderByTimestampAsc(ticketId).stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
    }


}
