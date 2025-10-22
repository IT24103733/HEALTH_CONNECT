package com.example.app.util;

import com.example.app.entity.User;
import com.example.app.exception.NotFoundException;
import com.example.app.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {
    private final UserService userService;

    public AuthUtil(UserService userService) {
        this.userService = userService;
    }

    public User getAuthenticatedUser(Authentication auth) {
        return userService.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
