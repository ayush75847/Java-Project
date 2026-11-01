package com.inkly.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
                @NotBlank @Pattern(regexp = "^[a-zA-Z0-9_]{3,20}$", message = "3-20 letters, numbers or _") String username,
                @NotBlank @Email String email,
                @NotBlank @Size(min = 6, max = 64, message = "must be 6-64 characters") String password) {
}