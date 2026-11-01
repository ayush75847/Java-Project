package com.inkly.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// Both fields are optional: send only what you want to change
public record UpdateProfileRequest(
        @Pattern(regexp = "^[a-zA-Z0-9_]{3,20}$", message = "3-20 letters, numbers or _") String username,
        @Size(max = 300, message = "must be 300 characters or less") String bio) {
}