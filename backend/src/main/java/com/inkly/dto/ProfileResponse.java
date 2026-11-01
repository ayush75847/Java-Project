package com.inkly.dto;

import java.time.Instant;

import com.inkly.model.User;

// Public profile: what ANYONE can see about a user (no email, no role)
public record ProfileResponse(String id, String username, String bio, Instant joinedAt) {

    public static ProfileResponse from(User user) {
        return new ProfileResponse(user.getId(), user.getUsername(), user.getBio(), user.getCreatedAt());
    }
}