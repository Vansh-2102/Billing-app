package com.vansh.billingapi.service;

import com.vansh.billingapi.io.OrderRequest;
import com.vansh.billingapi.io.OrderResponse;
import com.vansh.billingapi.io.PaymentVerificationRequest;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {

    OrderResponse createOrder(OrderRequest request);

    void deleteOrder(String orderId);

    List<OrderResponse> getLatestOrders();

    OrderResponse verifyPayment(PaymentVerificationRequest request);

    Double sumSalesByDate(LocalDate date);

    Long countByOrderDate(LocalDate date);

    List<OrderResponse> findrecentOrders();
}