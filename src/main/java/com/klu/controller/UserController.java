package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.klu.model.AuthResponse;
import com.klu.model.User;
import com.klu.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*", "https://*.vercel.app" }, allowedHeaders = "*")
public class UserController {

    @Autowired
    UserService us;

    @GetMapping
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(us.getAllUsers());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            AuthResponse authResponse = us.login(
                    user.getEmail(),
                    user.getPhone(),
                    user.getPassword(),
                    user.getRole()
            );
            return ResponseEntity.ok(authResponse);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exception.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(us.register(user));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + exception.getMessage());
        }
    }
}
