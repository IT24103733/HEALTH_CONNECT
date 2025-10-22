package com.example.app.controller;

import com.example.app.dto.UserDTO;
import com.example.app.exception.NotFoundException;
import com.example.app.service.SessionService;
import com.example.app.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final SessionService sessionService;

    public UserController(UserService userService, SessionService sessionService) {
        this.userService = userService;
        this.sessionService = sessionService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<UserDTO> users = userService.getAllUsers();
        int start = page * size;
        int end = Math.min(start + size, users.size());
        List<UserDTO> pageContent = users.subList(start, end);
        Page<UserDTO> userPage = new PageImpl<>(pageContent, PageRequest.of(page, size), users.size());
        return ResponseEntity.ok(userPage);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> updateCurrentUser(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String specialization = request.get("specialization");
        UserDTO updated = userService.updateCurrentUser(name, email, specialization);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id)
                .orElseThrow(() -> new NotFoundException("User not found")));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String specialization = request.get("specialization");
        UserDTO updated = UserDTO.fromEntity(userService.updateUserById(id, name, email, specialization));
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/active-count")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Map<String, Long>> getActiveUsersCount() {
        long count = sessionService.getActiveUsersCount();
        return ResponseEntity.ok(Map.of("activeUsers", count));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String roleStr = request.get("role");
        try {
            com.example.app.entity.User.Role newRole = com.example.app.entity.User.Role.valueOf(roleStr);
            UserDTO updated = UserDTO.fromEntity(userService.updateUserRole(id, newRole));
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + roleStr);
        }
    }
}
