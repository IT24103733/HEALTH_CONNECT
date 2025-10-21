package com.example.app.controller;

import com.example.app.dto.LoginRequest;
import com.example.app.dto.RegisterRequest;
import com.example.app.entity.User;
import com.example.app.exception.NotFoundException;
import com.example.app.exception.ValidationException;
import com.example.app.security.JwtUtil;
import com.example.app.service.SessionService;
import com.example.app.service.UserService;
import com.example.app.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final SessionService sessionService;
    private final AuthUtil authUtil;

    public AuthController(AuthenticationManager authenticationManager,
                         UserDetailsService userDetailsService,
                         JwtUtil jwtUtil,
                         UserService userService,
                         SessionService sessionService,
                         AuthUtil authUtil) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.sessionService = sessionService;
        this.authUtil = authUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new NotFoundException("User not found"));
        sessionService.createOrUpdateSession(user.getId(), token);
        
        return ResponseEntity.ok(Map.of(
            "token", token,
            "userId", user.getId(),
            "email", user.getEmail(),
            "role", user.getRole().name()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        User.Role role;
        try {
            role = User.Role.valueOf(request.getRole());
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid role value");
        }
        
        userService.createUser(request.getName(), request.getEmail(), request.getPassword(), 
                role, request.getSpecialization());
        
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(Authentication auth) {
        User user = authUtil.getAuthenticatedUser(auth);
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(auth.getName());
        String newToken = jwtUtil.generateToken(userDetails);
        sessionService.createOrUpdateSession(user.getId(), newToken);
        
        return ResponseEntity.ok(Map.of("token", newToken));
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Boolean>> validateSession(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(Map.of("valid", false));
        }
        
        String token = authHeader.substring(7);
        boolean valid = sessionService.isSessionValid(token);
        return ResponseEntity.ok(Map.of("valid", valid));
    }
}
