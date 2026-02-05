package com.vansh.billingapi.repository;

import com.vansh.billingapi.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional <UserEntity> findByEmail(String email);

    Optional<UserEntity> findByUserId(String userId);

    Optional<UserEntity> findByEmailIgnoreCase(String email);


    boolean existsByEmail(String email);
}
