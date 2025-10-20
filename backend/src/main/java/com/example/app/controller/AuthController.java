package com.example.app.controller;

import com.example.app.entity.User;
import com.example.app.security.JwtUtil;
import com.example.app.service.SessionService;
import com.example.app.service.UserService;
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

    public AuthController(AuthenticationManager authenticationManager,
                         UserDetailsService userDetailsService,
                         JwtUtil jwtUtil,
                         UserService userService,
                         SessionService sessionService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.sessionService = sessionService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String token = jwtUtil.generateToken(userDetails);
        
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        sessionService.createOrUpdateSession(user.getId(), token);
        
        return ResponseEntity.ok(Map.of(
            "token", token,
            "userId", user.getId(),
            "email", user.getEmail(),
            "role", user.getRole().name()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");
        String roleStr = request.getOrDefault("role", "PATIENT");
        String specialization = request.get("specialization");
        
        User.Role role = User.Role.valueOf(roleStr);
        userService.createUser(name, email, password, role, specialization);
        
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        User user = userService.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
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
