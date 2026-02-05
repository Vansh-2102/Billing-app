package com.vansh.billingapi.repository;

import com.vansh.billingapi.entity.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemRepository extends JpaRepository<ItemEntity, Long> {

    Optional<ItemEntity> findByItemId(String itemId);

    Integer countByCategory_Id(Long id);

}
