package com.ecobazaar.ecobazaar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.ecobazaar.ecobazaar.model.User;
import com.ecobazaar.ecobazaar.repository.UserRepository;

@RestController
@RequestMapping("/api/admin-request")
public class AdminRequestController {

    private final UserRepository userRepository;

    public AdminRequestController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/request")
    @PreAuthorize("isAuthenticated()") // Allow Users or Sellers to apply
    public ResponseEntity<String> requestAdminRole(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Check if already Admin
        if ("ROLE_ADMIN".equals(user.getRole())) {
            return ResponseEntity.badRequest().body("You are already an Admin");
        }

        // 2. Check if already Pending
        if (user.isAdminRequestPending()) {
            return ResponseEntity.badRequest().body("Request already pending");
        }

        // 3. Save Request
        user.setAdminRequestPending(true);
        userRepository.save(user);

        return ResponseEntity.ok("Admin request sent successfully");
    }

    @GetMapping("/has-pending")
    @PreAuthorize("isAuthenticated()")
    public boolean hasPendingRequest(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .map(User::isAdminRequestPending)
                .orElse(false);
    }
}