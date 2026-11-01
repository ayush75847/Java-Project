package com.inkly.dto;

import java.time.Instant;

import com.inkly.model.User;

// What an admin sees about each user (more than the public profile, never the password)
public record AdminUserResponse(String id, String username, String email, String role,
        String provider, boolean verified, Instant createdAt) {

    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name(),
                user.getProvider().name(), user.isVerified(), user.getCreatedAt());
    }
}