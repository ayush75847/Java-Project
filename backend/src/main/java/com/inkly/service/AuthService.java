package com.inkly.service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.inkly.dto.AuthResponse;
import com.inkly.dto.LoginRequest;
import com.inkly.dto.RegisterRequest;
import com.inkly.dto.UserResponse;
import com.inkly.dto.VerifyOtpRequest;
import com.inkly.exception.ApiException;
import com.inkly.model.User;
import com.inkly.repository.UserRepository;
import com.inkly.security.JwtService;

/**
 * Email + password sign-up:
 * 1. register -> account saved with verified=false, 6-digit code emailed
 * 2. verify-otp -> verified=true, user gets a JWT (logged in straight away)
 * 3. login -> only works once the email is verified
 */
@Service
public class AuthService {

    private static final Duration OTP_VALIDITY = Duration.ofMinutes(10);
    private static final Duration RESEND_WAIT = Duration.ofSeconds(60);
    private static final int MAX_OTP_ATTEMPTS = 5;

    private final SecureRandom random = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            JwtService jwtService, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    public UserResponse register(RegisterRequest request) {
        String username = request.username().trim().toLowerCase();
        String email = request.email().trim().toLowerCase();

        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null && user.isVerified()) {
            throw new ApiException(HttpStatus.CONFLICT, "Email already registered");
        }
        if (user == null) {
            user = new User();
        }
        // An UNverified account can register again (e.g. they lost the code or mistyped
        // something)
        if (!username.equals(user.getUsername()) && userRepository.existsByUsername(username)) {
            throw new ApiException(HttpStatus.CONFLICT, "Username already taken");
        }

        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password())); // never plain text
        user.setVerified(false);

        sendNewOtp(user);
        return UserResponse.from(user);
    }

    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        User user = findByEmail(request.email());

        if (user.isVerified()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email already verified. Please log in");
        }
        if (user.getOtp() == null || user.getOtpExpiry().isBefore(Instant.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Code expired. Please request a new one");
        }
        if (user.getOtpAttempts() >= MAX_OTP_ATTEMPTS) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Too many wrong attempts. Please request a new code");
        }
        if (!passwordEncoder.matches(request.otp(), user.getOtp())) {
            user.setOtpAttempts(user.getOtpAttempts() + 1);
            userRepository.save(user);
            int left = MAX_OTP_ATTEMPTS - user.getOtpAttempts();
            throw new ApiException(HttpStatus.BAD_REQUEST, "Wrong code (" + left + " attempts left)");
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setOtpAttempts(0);
        userRepository.save(user);

        return new AuthResponse(jwtService.generateToken(user), UserResponse.from(user));
    }

    public void resendOtp(String email) {
        User user = findByEmail(email);
        if (user.isVerified()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email already verified. Please log in");
        }
        sendNewOtp(user);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (user.getPassword() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This account uses Google sign-in");
        }
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        // Checked AFTER the password, so strangers can't find out which emails are
        // unverified
        if (!user.isVerified()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Please verify your email first");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }

    public UserResponse getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        return UserResponse.from(user);
    }

    // ---------- Helpers ----------

    private void sendNewOtp(User user) {
        // Max one email per minute per account (stops someone spamming an inbox)
        if (user.getOtpExpiry() != null) {
            Instant lastSent = user.getOtpExpiry().minus(OTP_VALIDITY);
            if (lastSent.plus(RESEND_WAIT).isAfter(Instant.now())) {
                throw new ApiException(HttpStatus.TOO_MANY_REQUESTS,
                        "Please wait a minute before asking for a new code");
            }
        }

        String code = String.format("%06d", random.nextInt(1_000_000)); // 000000 - 999999
        user.setOtp(passwordEncoder.encode(code)); // stored hashed, like a password
        user.setOtpExpiry(Instant.now().plus(OTP_VALIDITY));
        user.setOtpAttempts(0);
        userRepository.save(user);

        emailService.sendOtp(user.getEmail(), code);
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No account found with this email"));
    }
}