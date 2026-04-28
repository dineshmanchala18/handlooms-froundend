package com.klu.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.AuthResponse;
import com.klu.model.User;
import com.klu.repo.Userrepo;

@Service
public class UserService {

    @Autowired
    private Userrepo us;

    @Autowired
    private TokenService tokenService;

    public AuthResponse login(String email, String phone, String password, String role) {
        String normalizedRole = normalizeRole(role);
        User user = us.findByEmailAndRole(email, normalizedRole);

        if (user == null && phone != null && !phone.isBlank()) {
            user = us.findByPhoneAndRole(phone, normalizedRole);
        }

        if (user != null && password != null && password.equals(user.getPassword())) {
            return new AuthResponse(tokenService.createToken(user), user);
        }

        throw new IllegalArgumentException("Invalid email, phone, or password");
    }

    public AuthResponse register(User user) {
        user.setRole(normalizeRole(user.getRole()));

        if (us.existsByEmailAndRole(user.getEmail(), user.getRole())) {
            throw new IllegalArgumentException("Account already exists for this email and role");
        }

        User savedUser = us.save(user);
        return new AuthResponse(tokenService.createToken(savedUser), savedUser);
    }

    public List<User> getAllUsers() {
        return us.findAll();
    }

    public User updateUser(Long id, User updates) {
        User user = us.findById(id).orElse(null);

        if (user == null) {
            return null;
        }

        user.setName(updates.getName());
        user.setEmail(updates.getEmail());
        user.setPhone(updates.getPhone());
        user.setPhoto(updates.getPhoto());

        return us.save(user);
    }

    private String normalizeRole(String role) {
        return role == null || role.isBlank() ? "customer" : role.toLowerCase();
    }
}
