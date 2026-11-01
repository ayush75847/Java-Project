package com.inkly.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.inkly.dto.PostResponse;
import com.inkly.dto.ProfileResponse;
import com.inkly.dto.UpdateProfileRequest;
import com.inkly.dto.UserResponse;
import com.inkly.exception.ApiException;
import com.inkly.model.User;
import com.inkly.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PostService postService;

    public UserService(UserRepository userRepository, PostService postService) {
        this.userRepository = userRepository;
        this.postService = postService;
    }

    // ---------- Public ----------

    public ProfileResponse getProfile(String userId) {
        return ProfileResponse.from(findUser(userId));
    }

    public List<PostResponse> getUserPosts(String userId) {
        findUser(userId); // 404 if the user doesn't exist
        return postService.getActivePostsByUser(userId);
    }

    // ---------- Logged-in user (always their OWN profile) ----------

    public UserResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = findUser(userId);

        if (request.username() != null) {
            String username = request.username().trim().toLowerCase();
            if (!username.equals(user.getUsername()) && userRepository.existsByUsername(username)) {
                throw new ApiException(HttpStatus.CONFLICT, "Username already taken");
            }
            user.setUsername(username);
        }
        if (request.bio() != null) {
            String bio = request.bio().trim();
            user.setBio(bio.isEmpty() ? null : bio); // sending "" clears the bio
        }

        return UserResponse.from(userRepository.save(user));
    }

    // ---------- Helpers ----------

    private User findUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }
}