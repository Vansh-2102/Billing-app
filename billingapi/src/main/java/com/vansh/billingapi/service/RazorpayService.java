package com.vansh.billingapi.service;

import com.razorpay.RazorpayException;
import com.vansh.billingapi.io.RazorpayOrderResponse;

public interface RazorpayService {

    RazorpayOrderResponse createOrder(Double amount, String currency) throws RazorpayException;
}
