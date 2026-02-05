package com.vansh.billingapi.service.imp;

import com.vansh.billingapi.entity.UserEntity;
import com.vansh.billingapi.io.UserRequest;
import com.vansh.billingapi.io.UserResponse;
import com.vansh.billingapi.repository.UserRepository;
import com.vansh.billingapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
   private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        UserEntity newUser = convertToEntity(request);
        newUser = userRepository.save(newUser);
        return convertToResponse(newUser);
    }

    private UserResponse convertToResponse(UserEntity newUser) {
       return UserResponse.builder()
                .name(newUser.getName())
                .email(newUser.getEmail())
                .userId(newUser.getUserId())
                .createdAt(newUser.getCreatedAt())
                .updatedAt(newUser.getUpdatedAt())
                .role(newUser.getRole())
                .build();
    }

    private UserEntity convertToEntity(UserRequest request) {
        // Ensure role is uppercase and doesn't have ROLE_ prefix (will be added by AppUserDetailsService)
        String role = request.getRole() != null ? request.getRole().trim().toUpperCase() : "USER";
        if (role.startsWith("ROLE_")) {
            role = role.substring(5); // Remove ROLE_ prefix if present
        }
        
        return UserEntity.builder()
                .userId(UUID.randomUUID().toString())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .name(request.getName())
                .build();
    }

    @Override
    public String getUserRole(String email) {
       UserEntity existingUser = userRepository.findByEmailIgnoreCase(email.trim().toLowerCase())
               .orElseGet(() -> userRepository.findByEmail(email.trim().toLowerCase())
                       .orElseThrow(() -> new UsernameNotFoundException("User not found for the email: " + email)));
           return existingUser.getRole();
    }

    @Override
    public List<UserResponse> readUsers() {
     return    userRepository.findAll()
                .stream()
                .map(user -> convertToResponse(user) )
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String id) {
        UserEntity existingUser = userRepository.findByUserId(id)
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));
          userRepository.delete(existingUser);
    }
}
