package com.vansh.billingapi.controller;

import com.vansh.billingapi.io.AuthRequest;
import com.vansh.billingapi.io.AuthResponse;
import com.vansh.billingapi.service.UserService;
import com.vansh.billingapi.service.imp.AppUserDetailsService;
import com.vansh.billingapi.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final UserService userService;

    // ===============================
    // LOGIN
    // ===============================
    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        // ✅ Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        // ✅ Load UserDetails
        UserDetails userDetails =
                appUserDetailsService.loadUserByUsername(email);

        // ✅ FIX: generate token WITH roles
        String jwtToken = jwtUtil.generateToken(userDetails);

        String role = userService.getUserRole(email);

        return new AuthResponse(
                email,
                jwtToken,
                role
        );
    }

    // ===============================
    // PASSWORD ENCODER (UTILITY)
    // ===============================
    @PostMapping("/encode")
    public String encodePassword(@RequestBody Map<String, String> request) {
        return passwordEncoder.encode(request.get("password"));
    }

    // ===============================
    // DEBUG: Check current user role
    // ===============================
    @GetMapping("/me")
    public Map<String, Object> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return Map.of(
                "username", auth.getName(),
                "authorities", auth.getAuthorities().toString(),
                "authenticated", auth.isAuthenticated()
        );
    }
}
