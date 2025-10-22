package com.example.app.service;

import com.example.app.entity.UserSession;
import com.example.app.repository.UserSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SessionService {
    private final UserSessionRepository sessionRepository;

    public SessionService(UserSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Transactional
    public void createOrUpdateSession(Long userId, String token) {
        Optional<UserSession> existing = sessionRepository.findByUserId(userId);
        if (existing.isPresent()) {
            UserSession session = existing.get();
            session.setToken(token);
            session.setLastActivity(LocalDateTime.now());
            sessionRepository.save(session);
        } else {
            UserSession session = new UserSession(null, userId, token, LocalDateTime.now());
            sessionRepository.save(session);
        }
    }

    @Transactional
    public void updateActivity(String token) {
        Optional<UserSession> session = sessionRepository.findByToken(token);
        if (session.isPresent()) {
            session.get().setLastActivity(LocalDateTime.now());
            sessionRepository.save(session.get());
        }
    }

    public boolean isSessionValid(String token) {
        Optional<UserSession> session = sessionRepository.findByToken(token);
        if (session.isEmpty()) {
            return false;
        }
        LocalDateTime lastActivity = session.get().getLastActivity();
        return lastActivity.plusMinutes(30).isAfter(LocalDateTime.now());
    }

    public Optional<UserSession> getSessionByToken(String token) {
        return sessionRepository.findByToken(token);
    }

    public long getActiveUsersCount() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(30);
        return sessionRepository.countActiveUsers(cutoffTime);
    }
}
