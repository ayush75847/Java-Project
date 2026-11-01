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

import com.inkly.dto.AdminUserResponse;
import com.inkly.dto.ApiResponse;
import com.inkly.dto.PostResponse;
import com.inkly.dto.RoleUpdateRequest;
import com.inkly.service.AdminService;

import jakarta.validation.Valid;

// Every URL here is ADMIN-only: see .requestMatchers("/api/admin/**").hasRole("ADMIN") in SecurityConfig
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok("Users", adminService.getAllUsers()));
    }

    @GetMapping("/posts")
    public ResponseEntity<ApiResponse<List<PostResponse>>> getAllPosts() {
        return ResponseEntity.ok(ApiResponse.ok("All posts", adminService.getAllPosts()));
    }

    // Body: { "role": "ADMIN" } or { "role": "USER" }
    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<AdminUserResponse>> changeRole(@PathVariable String id,
            @Valid @RequestBody RoleUpdateRequest request, Authentication auth) {
        AdminUserResponse user = adminService.changeRole(id, request.role(), auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Role updated", user));
    }
}