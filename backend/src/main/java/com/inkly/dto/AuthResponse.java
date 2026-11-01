// dto/AuthResponse.java
package com.inkly.dto;

public record AuthResponse(String token, UserResponse user) {
}