package com.inkly.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.inkly.model.Post;
import com.inkly.model.PostStatus;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByStatusOrderByCreatedAtDesc(PostStatus status);

    List<Post> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Post> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, PostStatus status);
}