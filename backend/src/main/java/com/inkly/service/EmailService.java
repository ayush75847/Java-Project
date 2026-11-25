package com.inkly.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.time.Year;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.inkly.exception.ApiException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    // The design of the email lives in this file, not in Java code
    private static final String OTP_TEMPLATE = "email/otp-email.html";

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;
    private final String otpTemplate; // read once at startup

    public EmailService(JavaMailSender mailSender,
            @Value("${app.mail.enabled}") boolean enabled,
            @Value("${spring.mail.username}") String from) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
        this.otpTemplate = loadTemplate(OTP_TEMPLATE);
    }

    /**
     * Sends the 6-digit sign-up code as a nicely designed HTML email,
     * with a plain-text version for email apps that don't show HTML.
     */
    public void sendOtp(String to, String username, String code, long validMinutes) {
        // Development mode: no email account needed, the code shows up in the backend terminal
        if (!enabled) {
            log.info("[DEV] OTP for {} is {}", to, code);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            // true = "multipart": the email carries both an HTML and a plain-text version
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setFrom(from, "Inkly"); // shows as "Inkly" in the inbox instead of the bare address
            helper.setTo(to);
            // The code in the subject: it's visible straight from the phone's notification
            helper.setSubject(code + " is your Inkly verification code");
            helper.setText(buildOtpText(username, code, validMinutes), buildOtpHtml(username, code, validMinutes));

            mailSender.send(message);
        } catch (MailException | MessagingException | UnsupportedEncodingException e) {
            log.error("Could not send OTP email to {}", to, e);
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Could not send the email, please try again in a minute");
        }
    }

    /** The HTML version: the template with its {{placeholders}} filled in. */
    public String buildOtpHtml(String username, String code, long validMinutes) {
        return otpTemplate
                .replace("{{username}}", escapeHtml(username))
                .replace("{{code}}", escapeHtml(code))
                .replace("{{minutes}}", String.valueOf(validMinutes))
                .replace("{{year}}", String.valueOf(Year.now().getValue()));
    }

    /** The plain-text version, for email apps that can't (or won't) show HTML. */
    private String buildOtpText(String username, String code, long validMinutes) {
        return "Hi " + username + ",\n\n"
                + "Welcome to Inkly! Your verification code is:\n\n"
                + "    " + code + "\n\n"
                + "It expires in " + validMinutes + " minutes.\n\n"
                + "Never share this code with anyone. If you didn't sign up for Inkly, you can ignore this email.\n\n"
                + "Inkly · Where ideas find their ink.";
    }

    private static String loadTemplate(String path) {
        try (InputStream in = new ClassPathResource(path).getInputStream()) {
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            // Fail at startup, not later when someone signs up
            throw new IllegalStateException("Email template missing: " + path, e);
        }
    }

    private static String escapeHtml(String text) {
        return text == null ? "" : text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;").replace("'", "&#39;");
    }
}
