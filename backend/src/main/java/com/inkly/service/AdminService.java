package com.inkly.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.inkly.dto.AdminUserResponse;
import com.inkly.dto.PostResponse;
import com.inkly.exception.ApiException;
import com.inkly.model.Role;
import com.inkly.model.User;
import com.inkly.repository.UserRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PostService postService;

    public AdminService(UserRepository userRepository, PostService postService) {
        this.userRepository = userRepository;
        this.postService = postService;
    }

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(AdminUserResponse::from)
                .toList();
    }

    // ACTIVE and INACTIVE posts, for moderation
    public List<PostResponse> getAllPosts() {
        return postService.getAllPosts();
    }

    public AdminUserResponse changeRole(String targetUserId, Role newRole, String adminId) {
        // An admin can't demote themselves, so there is always at least one admin left
        if (targetUserId.equals(adminId)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You can't change your own role");
        }

        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        user.setRole(newRole);
        return AdminUserResponse.from(userRepository.save(user));
    }
}