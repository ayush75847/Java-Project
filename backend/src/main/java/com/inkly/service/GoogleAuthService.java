package com.inkly.service;

import java.text.Normalizer;

import org.springframework.stereotype.Service;

import com.inkly.model.AuthProvider;
import com.inkly.model.User;
import com.inkly.repository.UserRepository;
import com.inkly.security.JwtService;

/**
 * Google has already proved who the user is. Here we only decide which Inkly
 * account that is:
 * - email already known -> log into THAT account (no duplicate accounts)
 * - new email -> create a GOOGLE account (verified, no password)
 * Either way the result is our own JWT, exactly like email login.
 */
@Service
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public GoogleAuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public String loginWithGoogle(String email, String name) {
        String cleanEmail = email.trim().toLowerCase();

        User user = userRepository.findByEmail(cleanEmail).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(cleanEmail);
            newUser.setUsername(generateUniqueUsername(name, cleanEmail));
            newUser.setProvider(AuthProvider.GOOGLE); // no password: can only sign in with Google
            return newUser;
        });

        // Google verified this email, so an unfinished email sign-up is verified now
        // too
        if (!user.isVerified()) {
            user.setVerified(true);
            user.setOtp(null);
            user.setOtpExpiry(null);
            user.setOtpAttempts(0);
        }

        User saved = userRepository.save(user);
        return jwtService.generateToken(saved);
    }

    private String generateUniqueUsername(String name, String email) {
        String base = slugify(name);
        if (base.length() < 3) {
            base = slugify(email.substring(0, email.indexOf('@')));
        }
        if (base.length() < 3) {
            base = base.isEmpty() ? "user" : "user_" + base;
        }
        if (base.length() > 16) {
            base = base.substring(0, 16).replaceAll("_$", "");
        }

        String candidate = base;
        int number = 2;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + number++;
        }
        return candidate;
    }

    private String slugify(String text) {
        if (text == null) {
            return "";
        }
        return Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "_")
                .replaceAll("^_+|_+$", "");
    }
}