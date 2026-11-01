package com.inkly.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import com.inkly.dto.ApiResponse;
import com.inkly.dto.PostRequest;
import com.inkly.dto.PostResponse;
import com.inkly.service.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Public
    @GetMapping
    public ResponseEntity<ApiResponse<List<PostResponse>>> getActivePosts() {
        return ResponseEntity.ok(ApiResponse.ok("Posts", postService.getActivePosts()));
    }

    // Logged in (this rule is in SecurityConfig)
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PostResponse>>> getMyPosts(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.ok("My posts", postService.getMyPosts(auth.getName())));
    }

    // Public, but owner/admin can also see INACTIVE posts
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPost(@PathVariable String id, Authentication auth) {
        PostResponse post = postService.getPost(id, userId(auth), isAdmin(auth));
        return ResponseEntity.ok(ApiResponse.ok("Post", post));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> create(@Valid @RequestBody PostRequest request,
            Authentication auth) {
        PostResponse post = postService.create(request, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Post created", post));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> update(@PathVariable String id,
            @Valid @RequestBody PostRequest request,
            Authentication auth) {
        PostResponse post = postService.update(id, request, auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Post updated", post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id, Authentication auth) {
        postService.delete(id, auth.getName(), isAdmin(auth));
        return ResponseEntity.ok(ApiResponse.ok("Post deleted", null));
    }

    // ---------- Image ----------

    // Send as form-data with a field called "image" (adds or replaces the post's
    // image)
    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PostResponse>> uploadImage(@PathVariable String id,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication auth) {
        PostResponse post = postService.uploadImage(id, image, auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Image uploaded", post));
    }

    @DeleteMapping("/{id}/image")
    public ResponseEntity<ApiResponse<PostResponse>> removeImage(@PathVariable String id, Authentication auth) {
        PostResponse post = postService.removeImage(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.ok("Image removed", post));
    }

    // ---------- Helpers ----------

    // auth is null when nobody is logged in (public endpoints)
    private String userId(Authentication auth) {
        return auth == null ? null : auth.getName();
    }

    private boolean isAdmin(Authentication auth) {
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}