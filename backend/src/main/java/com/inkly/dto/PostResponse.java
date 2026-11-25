package com.inkly.dto;

import java.time.Instant;

import com.inkly.model.Post;
import com.inkly.model.User;
import com.inkly.util.ContentPreview;

/**
 * A post as the API sends it.
 *   preview        = true when "content" is only the beginning of the post
 *                    (visitors who are not logged in), false for the full text
 *   readingMinutes = reading time of the FULL post, even in a preview
 */
public record PostResponse(String id, String title, String content, String imageUrl, String status,
                           Instant createdAt, Instant updatedAt, AuthorInfo author,
                           boolean preview, int readingMinutes) {

    // Only the public details of the author (never email or password)
    public record AuthorInfo(String id, String username, String profileImage) {
    }

    /** The full post (logged-in users, the owner, admins). */
    public static PostResponse from(Post post, User author) {
        return from(post, author, true);
    }

    /** fullContent = false: only a short preview of the text (visitors who are not logged in). */
    public static PostResponse from(Post post, User author, boolean fullContent) {
        AuthorInfo authorInfo = (author == null)
                ? new AuthorInfo(post.getUserId(), "deleted user", null)
                : new AuthorInfo(author.getId(), author.getUsername(), author.getProfileImage());

        // Short posts have nothing to hide: the preview would be the whole post anyway
        boolean showPreview = !fullContent && ContentPreview.isLongerThanPreview(post.getContent());
        String content = showPreview ? ContentPreview.preview(post.getContent()) : post.getContent();

        return new PostResponse(post.getId(), post.getTitle(), content, post.getImageUrl(),
                post.getStatus().name(), post.getCreatedAt(), post.getUpdatedAt(), authorInfo,
                showPreview, ContentPreview.readingMinutes(post.getContent()));
    }
}
