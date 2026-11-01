package com.inkly.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.inkly.exception.ApiException;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;

    public EmailService(JavaMailSender mailSender,
            @Value("${app.mail.enabled}") boolean enabled,
            @Value("${spring.mail.username}") String from) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
    }

    public void sendOtp(String to, String code) {
        // Development mode: no email account needed, the code shows up in the backend
        // terminal
        if (!enabled) {
            log.info("[DEV] OTP for {} is {}", to, code);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject("Your Inkly verification code");
        message.setText("Your verification code is " + code + "\n\n"
                + "It expires in 10 minutes.\n"
                + "If you didn't sign up for Inkly, you can ignore this email.");

        try {
            mailSender.send(message);
        } catch (MailException e) {
            log.error("Could not send OTP email to {}", to, e);
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Could not send the email, please try again in a minute");
        }
    }
}