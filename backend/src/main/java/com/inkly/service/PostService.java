package com.inkly.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.inkly.dto.PostRequest;
import com.inkly.dto.PostResponse;
import com.inkly.exception.ApiException;
import com.inkly.model.Post;
import com.inkly.model.PostStatus;
import com.inkly.model.User;
import com.inkly.repository.PostRepository;
import com.inkly.repository.UserRepository;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ImageService imageService;

    public PostService(PostRepository postRepository, UserRepository userRepository, ImageService imageService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.imageService = imageService;
    }

    // ---------- Create ----------

    public PostResponse create(PostRequest request, String userId) {
        Post post = new Post();
        post.setUserId(userId); // owner comes from the token, never from the request
        post.setTitle(request.title().trim());
        post.setContent(request.content());
        if (request.status() != null) {
            post.setStatus(request.status());
        }
        Post saved = postRepository.save(post);
        return toResponse(saved);
    }

    // ---------- Read ----------

    // Public feed: only ACTIVE posts, newest first.
    // fullContent = false for visitors who are not logged in: they only get a preview of each post.
    public List<PostResponse> getActivePosts(boolean fullContent) {
        return toResponses(postRepository.findByStatusOrderByCreatedAtDesc(PostStatus.ACTIVE), fullContent);
    }

    // userId is null when nobody is logged in: then only a preview of the text is returned
    public PostResponse getPost(String postId, String userId, boolean isAdmin) {
        Post post = findPost(postId);

        // INACTIVE posts are hidden from everyone except the owner and admins
        if (post.getStatus() == PostStatus.INACTIVE && !isOwner(post, userId) && !isAdmin) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Post not found");
        }
        return toResponse(post, userId != null);
    }

    public List<PostResponse> getMyPosts(String userId) {
        return toResponses(postRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    // Someone's public profile page: only their ACTIVE posts (a preview each for visitors)
    public List<PostResponse> getActivePostsByUser(String userId, boolean fullContent) {
        return toResponses(postRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, PostStatus.ACTIVE),
                fullContent);
    }

    // Admin: every post, ACTIVE and INACTIVE
    public List<PostResponse> getAllPosts() {
        return toResponses(postRepository.findAllByOrderByCreatedAtDesc());
    }

    // ---------- Update (owner only, admins can NOT edit) ----------

    public PostResponse update(String postId, PostRequest request, String userId) {
        Post post = findPost(postId);

        if (!isOwner(post, userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the author can edit this post");
        }

        post.setTitle(request.title().trim());
        post.setContent(request.content());
        if (request.status() != null) {
            post.setStatus(request.status());
        }
        post.setUpdatedAt(Instant.now());

        return toResponse(postRepository.save(post));
    }

    // ---------- Delete (owner or admin) ----------

    public void delete(String postId, String userId, boolean isAdmin) {
        Post post = findPost(postId);

        if (!isOwner(post, userId) && !isAdmin) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only delete your own posts");
        }
        postRepository.delete(post);
        imageService.delete(post.getImagePublicId());
    }

    // ---------- Image (owner only, one image per post) ----------

    public PostResponse uploadImage(String postId, MultipartFile file, String userId) {
        Post post = findPost(postId);
        if (!isOwner(post, userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the author can change the image");
        }

        String oldPublicId = post.getImagePublicId();

        // 1. upload the new image first, so a failed upload leaves the post unchanged
        ImageService.UploadedImage image = imageService.upload(file);
        post.setImageUrl(image.url());
        post.setImagePublicId(image.publicId());
        post.setUpdatedAt(Instant.now());
        Post saved = postRepository.save(post);

        // 2. then remove the old one (replacing an image)
        imageService.delete(oldPublicId);

        return toResponse(saved);
    }

    public PostResponse removeImage(String postId, String userId) {
        Post post = findPost(postId);
        if (!isOwner(post, userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the author can change the image");
        }

        imageService.delete(post.getImagePublicId());
        post.setImageUrl(null);
        post.setImagePublicId(null);
        post.setUpdatedAt(Instant.now());
        return toResponse(postRepository.save(post));
    }

    // ---------- Helpers ----------

    private Post findPost(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Post not found"));
    }

    private boolean isOwner(Post post, String userId) {
        return userId != null && userId.equals(post.getUserId());
    }

    private PostResponse toResponse(Post post) {
        return toResponse(post, true);
    }

    private PostResponse toResponse(Post post, boolean fullContent) {
        User author = userRepository.findById(post.getUserId()).orElse(null);
        return PostResponse.from(post, author, fullContent);
    }

    private List<PostResponse> toResponses(List<Post> posts) {
        return toResponses(posts, true);
    }

    // For lists: load all authors in ONE query instead of one query per post
    private List<PostResponse> toResponses(List<Post> posts, boolean fullContent) {
        Set<String> authorIds = posts.stream().map(Post::getUserId).collect(Collectors.toSet());
        Map<String, User> authors = userRepository.findAllById(authorIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        return posts.stream()
                .map(post -> PostResponse.from(post, authors.get(post.getUserId()), fullContent))
                .toList();
    }
}