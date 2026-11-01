package com.inkly.dto;

import com.inkly.model.PostStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostRequest(
        @NotBlank @Size(max = 150) String title,
        @NotBlank String content,
        PostStatus status) { 
}