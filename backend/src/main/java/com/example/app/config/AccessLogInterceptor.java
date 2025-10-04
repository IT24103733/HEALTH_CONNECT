package com.example.app.config;

import com.example.app.entity.User;
import com.example.app.service.AccessLogService;
import com.example.app.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AccessLogInterceptor implements HandlerInterceptor {
    private final AccessLogService accessLogService;
    private final UserService userService;

    public AccessLogInterceptor(AccessLogService accessLogService, UserService userService) {
        this.accessLogService = accessLogService;
        this.userService = userService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            try {
                User user = userService.findByEmail(auth.getName()).orElse(null);
                if (user != null) {
                    String action = request.getMethod();
                    String resource = request.getRequestURI();
                    String ipAddress = request.getRemoteAddr();
                    
                    accessLogService.logAccess(user.getId(), action, resource, ipAddress);
                }
            } catch (Exception e) {
                // Log error but don't block request
            }
        }
        
        return true;
    }
}
