package com.inkly.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.inkly.model.Role;
import com.inkly.model.User;
import com.inkly.repository.UserRepository;

/**
 * Runs once every time the app starts.
 * Nobody can register as ADMIN, so the first admin comes from the .env file.
 * That admin can then promote other users through the admin API.
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String email;
    private final String password;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder,
            @Value("${app.admin.username}") String username,
            @Value("${app.admin.email}") String email,
            @Value("${app.admin.password}") String password) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.username = username.trim().toLowerCase();
        this.email = email.trim().toLowerCase();
        this.password = password;
    }

    @Override
    public void run(String... args) {
        if (email.isEmpty() || password.isEmpty()) {
            log.info("ADMIN_EMAIL / ADMIN_PASSWORD not set: skipping admin creation");
            return;
        }

        // Already exists? Just make sure it is an ADMIN (never touch the password)
        User existing = userRepository.findByEmail(email).orElse(null);
        if (existing != null) {
            if (existing.getRole() != Role.ADMIN) {
                existing.setRole(Role.ADMIN);
                userRepository.save(existing);
                log.info("Promoted existing user {} to ADMIN", email);
            }
            return;
        }

        if (password.length() < 6 || password.length() > 64) {
            log.warn("ADMIN_PASSWORD must be 6-64 characters: admin not created");
            return;
        }
        if (userRepository.existsByUsername(username)) {
            log.warn("Username '{}' is already taken: set a different ADMIN_USERNAME", username);
            return;
        }

        User admin = new User();
        admin.setUsername(username);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole(Role.ADMIN);
        admin.setVerified(true);
        userRepository.save(admin);
        log.info("Created admin account {}", email);
    }
}