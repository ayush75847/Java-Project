package com.inkly.dto;

import com.inkly.model.Role;

import jakarta.validation.constraints.NotNull;

public record RoleUpdateRequest(@NotNull Role role) {
}