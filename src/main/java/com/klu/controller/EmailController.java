package com.klu.controller;
import com.klu.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mail")
@CrossOrigin
public class EmailController {

    @Autowired
    private EmailService emailService;

    // Simple Email API
    @GetMapping("/send")
    public String sendSimpleMail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String text) {

        return emailService.sendSimpleMail(to, subject, text);
    }

    // Email with Attachment API
    @PostMapping("/send-attachment")
    public String sendMailWithAttachment(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String text,
            @RequestParam String path) {

        return emailService.sendMailWithAttachment(to, subject, text, path);
    }
}

