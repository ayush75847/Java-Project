package com.example.blog.repository;

import com.example.blog.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

// Spring Data writes the query for us from the method name.
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
