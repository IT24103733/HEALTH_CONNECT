package com.example.app.repository;

import com.example.app.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRecipientIdOrderByTimestampDesc(Long recipientId);
    List<Message> findBySenderIdOrderByTimestampDesc(Long senderId);
}
