package com.vansh.billingapi.controller;

import com.razorpay.RazorpayException;
import com.vansh.billingapi.io.OrderResponse;
import com.vansh.billingapi.io.PaymentRequest;
import com.vansh.billingapi.io.PaymentVerificationRequest;
import com.vansh.billingapi.io.RazorpayOrderResponse;
import com.vansh.billingapi.service.OrderService;
import com.vansh.billingapi.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;
    private final OrderService orderService;

    @PostMapping("/create-order")
    @ResponseStatus(HttpStatus.CREATED)
    public RazorpayOrderResponse createRazorpayOrder(@RequestBody PaymentRequest request) throws RazorpayException {
        return  razorpayService.createOrder(request.getAmount(), request.getCurrency());
    }

    @PostMapping("/verify")
    public OrderResponse verifyPayment(@RequestBody PaymentVerificationRequest request) {
        return orderService.verifyPayment(request);
    }
}
