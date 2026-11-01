package com.inkly.dto;

import java.time.Instant;

import com.inkly.model.Post;
import com.inkly.model.User;

public record PostResponse(String id, String title, String content, String imageUrl, String status,
                           Instant createdAt, Instant updatedAt, AuthorInfo author) {

    // Only the public details of the author (never email or password)
    public record AuthorInfo(String id, String username, String profileImage) {
    }

    public static PostResponse from(Post post, User author) {
        AuthorInfo authorInfo = (author == null)
                ? new AuthorInfo(post.getUserId(), "deleted user", null)
                : new AuthorInfo(author.getId(), author.getUsername(), author.getProfileImage());

        return new PostResponse(post.getId(), post.getTitle(), post.getContent(), post.getImageUrl(),
                post.getStatus().name(), post.getCreatedAt(), post.getUpdatedAt(), authorInfo);
    }
}