package com.vansh.billingapi.io;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDetails {

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus status;

    public enum PaymentStatus {
        PENDING,
        COMPLETED,
        FAILED
    }
}