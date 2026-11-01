package com.example.blog.service;

import com.example.blog.dto.Dtos.AuthResponse;
import com.example.blog.dto.Dtos.LoginRequest;
import com.example.blog.dto.Dtos.RegisterRequest;
import com.example.blog.dto.Dtos.UserResponse;
import com.example.blog.exception.ApiException;
import com.example.blog.model.AuthProvider;
import com.example.blog.model.User;
import com.example.blog.repository.UserRepository;
import com.example.blog.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

/**
 * Email + password sign-up flow:
 *   1. register      -> user saved with verified=false, 6-digit OTP emailed
 *   2. verify-otp    -> user becomes verified, gets a JWT
 *   3. login         -> only works for verified users
 */
@Service
public class AuthService {

    private static final Duration OTP_VALIDITY = Duration.ofMinutes(10);
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

    public void register(RegisterRequest req) {
        String email = req.email().toLowerCase().trim();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null && user.isVerified()) {
            throw new ApiException(HttpStatus.CONFLICT, "Email is already registered. Please log in.");
        }
        if (user == null) {
            user = new User();
            user.setEmail(email);
        }
        // An unverified user may register again (e.g. they lost the OTP): we just overwrite the details.
        user.setName(req.name());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setProvider(AuthProvider.LOCAL);
        user.setVerified(false);
        sendNewOtp(user);
    }

    public AuthResponse verifyOtp(String email, String otp) {
        User user = findUser(email);
        if (user.isVerified()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Account is already verified. Please log in.");
        }
        if (user.getOtpCode() == null || user.getOtpExpiresAt().isBefore(Instant.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "OTP expired. Please request a new one.");
        }
        if (!user.getOtpCode().equals(otp.trim())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid OTP.");
        }
        user.setVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiresAt(null);
        userRepository.save(user);
        return toAuthResponse(user);
    }

    public void resendOtp(String email) {
        User user = findUser(email);
        if (user.isVerified()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Account is already verified. Please log in.");
        }
        sendNewOtp(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email().toLowerCase().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));

        if (user.getPassword() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This account uses Google sign-in.");
        }
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        if (!user.isVerified()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Please verify your email first.");
        }
        return toAuthResponse(user);
    }

    public UserResponse me(String email) {
        return UserResponse.from(findUser(email));
    }

    private void sendNewOtp(User user) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        user.setOtpCode(otp);
        user.setOtpExpiresAt(Instant.now().plus(OTP_VALIDITY));
        userRepository.save(user);
        emailService.sendOtp(user.getEmail(), otp);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found."));
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(jwtService.generateToken(user), UserResponse.from(user));
    }
}
