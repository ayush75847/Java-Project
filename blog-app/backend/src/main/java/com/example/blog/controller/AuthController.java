package com.example.blog.controller;

import com.example.blog.dto.Dtos.AuthResponse;
import com.example.blog.dto.Dtos.EmailRequest;
import com.example.blog.dto.Dtos.LoginRequest;
import com.example.blog.dto.Dtos.MessageResponse;
import com.example.blog.dto.Dtos.RegisterRequest;
import com.example.blog.dto.Dtos.UserResponse;
import com.example.blog.dto.Dtos.VerifyOtpRequest;
import com.example.blog.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// "Login with Google" has no controller: Spring Security handles /oauth2/authorization/google for us.
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public MessageResponse register(@Valid @RequestBody RegisterRequest req) {
        authService.register(req);
        return new MessageResponse("OTP sent to " + req.email());
    }

    @PostMapping("/verify-otp")
    public AuthResponse verifyOtp(@Valid @RequestBody VerifyOtpRequest req) {
        return authService.verifyOtp(req.email(), req.otp());
    }

    @PostMapping("/resend-otp")
    public MessageResponse resendOtp(@Valid @RequestBody EmailRequest req) {
        authService.resendOtp(req.email());
        return new MessageResponse("A new OTP was sent to " + req.email());
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    /** Who am I? The frontend calls this after a page reload to restore the logged-in user. */
    @GetMapping("/me")
    public UserResponse me(Authentication auth) {
        return authService.me(auth.getName());
    }
}
