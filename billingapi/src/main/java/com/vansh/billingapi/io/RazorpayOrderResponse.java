package com.vansh.billingapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RazorpayOrderResponse {
    private String id;
    private String entity;
    private Integer amount;
    private String currency;
    private String status;
    private Long created_at;
    private String receipt;

}
