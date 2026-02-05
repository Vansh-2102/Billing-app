package com.vansh.billingapi.service.imp;

import com.vansh.billingapi.entity.UserEntity;
import com.vansh.billingapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(AppUserDetailsService.class);

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if (email == null || email.isBlank()) {
            throw new UsernameNotFoundException("Email is null or empty");
        }

        // normalize input (trim + lowercase)
        String normalizedEmail = email.trim().toLowerCase();
        log.debug("Loading user by email (normalized): {}", normalizedEmail);

        // try case-insensitive finder if available, otherwise fallback to findByEmail
        UserEntity existingUser = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseGet(() -> userRepository.findByEmail(normalizedEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("Email not found for the email: " + email)));

        // ensure role has ROLE_ prefix
        String role = existingUser.getRole() == null ? "ROLE_USER" : existingUser.getRole().trim().toUpperCase();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        // return normalized principal (email) and granted authority
        return new User(
                existingUser.getEmail().trim().toLowerCase(),
                existingUser.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(role))
        );
    }
}
