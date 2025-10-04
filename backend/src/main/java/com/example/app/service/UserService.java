package com.example.app.service;

import com.example.app.dto.UserDTO;
import com.example.app.entity.User;
import com.example.app.repository.UserRepository;
import com.example.app.util.HtmlSanitizer;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final HtmlSanitizer htmlSanitizer;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, HtmlSanitizer htmlSanitizer, 
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.htmlSanitizer = htmlSanitizer;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public User createUser(String name, String email, String password, User.Role role) {
        String sanitizedName = htmlSanitizer.sanitize(name);
        String hashedPassword = passwordEncoder.encode(password);
        
        User user = new User(null, sanitizedName, email, hashedPassword, role, LocalDateTime.now());
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, String name, String email) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String sanitizedName = htmlSanitizer.sanitize(name);
        user.setName(sanitizedName);
        user.setEmail(email);
        
        return userRepository.save(user);
    }

    public List<User> findByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id).map(UserDTO::fromEntity);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
