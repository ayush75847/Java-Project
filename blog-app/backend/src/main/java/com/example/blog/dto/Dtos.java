package com.example.blog.dto;

import com.example.blog.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request/response shapes for the API, kept together in one file so beginners can see them all at once.
 * A Java "record" is a small immutable class: fields, constructor and getters are generated for you.
 */
public final class Dtos {

    private Dtos() {}

    public record RegisterRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6, message = "must be at least 6 characters") String password) {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    public record VerifyOtpRequest(@NotBlank @Email String email, @NotBlank String otp) {}

    public record EmailRequest(@NotBlank @Email String email) {}

    public record PostRequest(
            @NotBlank @Size(max = 200) String title,
            @NotBlank String content) {}

    public record MessageResponse(String message) {}

    public record UserResponse(String id, String name, String email, String role, String provider) {
        public static UserResponse from(User u) {
            return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole().name(), u.getProvider().name());
        }
    }

    public record AuthResponse(String token, UserResponse user) {}
}
