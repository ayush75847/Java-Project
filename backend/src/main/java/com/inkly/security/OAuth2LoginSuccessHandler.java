package com.inkly.security;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.inkly.service.GoogleAuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 * Runs after Google sends the user back to us successfully.
 * We turn the Google account into an Inkly JWT and send the browser to the
 * React app.
 */
@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final GoogleAuthService googleAuthService;
    private final String frontendUrl;

    public OAuth2LoginSuccessHandler(GoogleAuthService googleAuthService,
            @Value("${app.frontend-url}") String frontendUrl) {
        this.googleAuthService = googleAuthService;
        this.frontendUrl = frontendUrl;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        OAuth2User googleUser = (OAuth2User) authentication.getPrincipal();
        String email = googleUser.getAttribute("email");
        String name = googleUser.getAttribute("name");
        Boolean emailVerified = googleUser.getAttribute("email_verified");

        // The short session Spring used during the Google redirect is no longer needed:
        // we use JWTs
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        if (email == null || !Boolean.TRUE.equals(emailVerified)) {
            redirectWithError(response, "Your Google account has no verified email");
            return;
        }

        String token = googleAuthService.loginWithGoogle(email, name);
        // "#" (fragment) instead of "?": the token is never sent to any server or
        // stored in its logs
        response.sendRedirect(frontendUrl + "/oauth/callback#token=" + token);
    }

    private void redirectWithError(HttpServletResponse response, String message) throws IOException {
        response.sendRedirect(frontendUrl + "/oauth/callback#error="
                + URLEncoder.encode(message, StandardCharsets.UTF_8));
    }
}