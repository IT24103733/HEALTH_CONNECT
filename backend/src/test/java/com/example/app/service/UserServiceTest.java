package com.example.app.service;

import com.example.app.entity.User;
import com.example.app.repository.UserRepository;
import com.example.app.util.HtmlSanitizer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private HtmlSanitizer htmlSanitizer;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateUser() {
        String name = "Test User";
        String email = "test@example.com";
        String password = "password123";
        User.Role role = User.Role.PATIENT;
        
        when(htmlSanitizer.sanitize(name)).thenReturn(name);
        when(passwordEncoder.encode(password)).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        
        User result = userService.createUser(name, email, password, role);
        
        assertNotNull(result);
        assertEquals(name, result.getName());
        assertEquals(email, result.getEmail());
        assertEquals(role, result.getRole());
        verify(htmlSanitizer).sanitize(name);
        verify(passwordEncoder).encode(password);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testFindByEmail() {
        String email = "test@example.com";
        User user = new User(1L, "Test", email, "hash", User.Role.PATIENT, LocalDateTime.now());
        
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        
        Optional<User> result = userService.findByEmail(email);
        
        assertTrue(result.isPresent());
        assertEquals(email, result.get().getEmail());
        verify(userRepository).findByEmail(email);
    }

    @Test
    void testUpdateUser() {
        Long userId = 1L;
        String newName = "Updated Name";
        String newEmail = "updated@example.com";
        User existingUser = new User(userId, "Old Name", "old@example.com", 
                "hash", User.Role.PATIENT, LocalDateTime.now());
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(htmlSanitizer.sanitize(newName)).thenReturn(newName);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        
        User result = userService.updateUser(userId, newName, newEmail);
        
        assertNotNull(result);
        assertEquals(newName, result.getName());
        assertEquals(newEmail, result.getEmail());
        verify(htmlSanitizer).sanitize(newName);
        verify(userRepository).save(any(User.class));
    }
}
