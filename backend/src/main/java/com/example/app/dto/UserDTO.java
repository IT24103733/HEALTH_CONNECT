package com.example.app.dto;

import com.example.app.entity.User;

public class UserDTO {
    private final Long id;
    private final String name;
    private final String email;
    private final String role;
    private final String specialty;

    public UserDTO(Long id, String name, String email, String role, String specialty) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.specialty = specialty;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getSpecialty() {
        return specialty;
    }

    public static UserDTO fromEntity(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.getSpecialty());
    }
}
