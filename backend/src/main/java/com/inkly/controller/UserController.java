package com.inkly.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inkly.dto.ApiResponse;
import com.inkly.dto.PostResponse;
import com.inkly.dto.ProfileResponse;
import com.inkly.dto.UpdateProfileRequest;
import com.inkly.dto.UserResponse;
import com.inkly.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Your own profile (uses /me, so you can never edit someone else)
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@Valid @RequestBody UpdateProfileRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", userService.updateProfile(auth.getName(), request)));
    }

    // Public
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok("Profile", userService.getProfile(id)));
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<ApiResponse<List<PostResponse>>> getUserPosts(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok("Posts", userService.getUserPosts(id)));
    }
}