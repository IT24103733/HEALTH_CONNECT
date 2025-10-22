package com.example.app.repository;

import com.example.app.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    Optional<UserSession> findByUserId(Long userId);
    Optional<UserSession> findByToken(String token);
    
    @Query("SELECT COUNT(DISTINCT s.userId) FROM UserSession s WHERE s.lastActivity > :cutoffTime")
    long countActiveUsers(@Param("cutoffTime") LocalDateTime cutoffTime);
}
