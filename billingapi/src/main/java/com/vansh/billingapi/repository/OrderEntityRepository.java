package com.vansh.billingapi.repository;

import com.vansh.billingapi.entity.OrderEntity;
import com.vansh.billingapi.io.PaymentDetails;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderEntityRepository extends JpaRepository<OrderEntity, Long> {

    Optional<OrderEntity> findByOrderId(String orderId);

    List<OrderEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // ✅ SUM ONLY COMPLETED PAYMENTS
    @Query("""
       SELECT COALESCE(SUM(o.grandTotal), 0)
       FROM OrderEntity o
       WHERE o.createdAt BETWEEN :start AND :end
       AND o.paymentDetails.status = :status
       """)
    Double sumSalesBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("status") PaymentDetails.PaymentStatus status
    );

    // ✅ COUNT ONLY COMPLETED ORDERS
    @Query("""
       SELECT COUNT(o)
       FROM OrderEntity o
       WHERE o.createdAt BETWEEN :start AND :end
       AND o.paymentDetails.status = :status
       """)
    Long countOrdersBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("status") PaymentDetails.PaymentStatus status
    );
}