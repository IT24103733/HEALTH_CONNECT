package com.example.app.service;

import com.example.app.entity.Message;
import com.example.app.repository.MessageRepository;
import com.example.app.util.HtmlSanitizer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class MessageServiceTest {
    @Mock
    private MessageRepository messageRepository;
    
    @Mock
    private HtmlSanitizer htmlSanitizer;
    
    @InjectMocks
    private MessageService messageService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendMessage() {
        Long senderId = 1L;
        Long recipientId = 2L;
        String content = "Test message";
        
        when(htmlSanitizer.sanitize(content)).thenReturn(content);
        when(messageRepository.save(any(Message.class))).thenAnswer(i -> i.getArguments()[0]);
        
        Message result = messageService.sendMessage(senderId, recipientId, content);
        
        assertNotNull(result);
        assertEquals(senderId, result.getSenderId());
        assertEquals(recipientId, result.getRecipientId());
        assertEquals(content, result.getContent());
        verify(htmlSanitizer).sanitize(content);
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void testGetInbox() {
        Long userId = 1L;
        Message msg1 = new Message(1L, 2L, userId, "Message 1", LocalDateTime.now());
        Message msg2 = new Message(2L, 3L, userId, "Message 2", LocalDateTime.now());
        
        when(messageRepository.findByRecipientIdOrderByTimestampDesc(userId))
                .thenReturn(Arrays.asList(msg1, msg2));
        
        List<com.example.app.dto.MessageDTO> result = messageService.getInbox(userId);
        
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(messageRepository).findByRecipientIdOrderByTimestampDesc(userId);
    }

    @Test
    void testSanitizesHtmlContent() {
        Long senderId = 1L;
        Long recipientId = 2L;
        String maliciousContent = "<script>alert('xss')</script>Hello";
        String sanitizedContent = "Hello";
        
        when(htmlSanitizer.sanitize(maliciousContent)).thenReturn(sanitizedContent);
        when(messageRepository.save(any(Message.class))).thenAnswer(i -> i.getArguments()[0]);
        
        Message result = messageService.sendMessage(senderId, recipientId, maliciousContent);
        
        assertEquals(sanitizedContent, result.getContent());
        verify(htmlSanitizer).sanitize(maliciousContent);
    }
}
