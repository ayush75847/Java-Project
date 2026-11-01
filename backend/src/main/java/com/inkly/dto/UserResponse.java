// UserResponse.java: what we send back (no password!)
package com.inkly.dto;

import com.inkly.model.User;

public record UserResponse(String id, String username, String email,
                           String bio, String profileImage, String role) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(),
                user.getBio(), user.getProfileImage(), user.getRole().name());
    }
}