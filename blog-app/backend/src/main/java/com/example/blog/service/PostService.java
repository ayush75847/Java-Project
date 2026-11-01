package com.example.blog.service;

import com.example.blog.dto.Dtos.PostRequest;
import com.example.blog.exception.ApiException;
import com.example.blog.model.Post;
import com.example.blog.model.Role;
import com.example.blog.model.User;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<Post> getAll() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Post getById(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Post not found."));
    }

    public List<Post> getMine(String email) {
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(currentUser(email).getId());
    }

    public Post create(PostRequest req, String email) {
        User author = currentUser(email);
        Post post = new Post();
        post.setTitle(req.title());
        post.setContent(req.content());
        post.setAuthorId(author.getId());
        post.setAuthorName(author.getName());
        return postRepository.save(post);
    }

    /** Authors can delete their own posts. Admins can delete any post. */
    public void delete(String postId, String email) {
        User user = currentUser(email);
        Post post = getById(postId);

        boolean isOwner = post.getAuthorId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only delete your own posts.");
        }
        postRepository.delete(post);
    }

    private User currentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found."));
    }
}
