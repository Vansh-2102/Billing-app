package com.vansh.billingapi.service.imp;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.vansh.billingapi.io.RazorpayOrderResponse;
import com.vansh.billingapi.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RazorpayServiceImpl implements RazorpayService {
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    @Override
    public RazorpayOrderResponse createOrder(Double amount, String currency) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100);
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", "order_rcptid_"+System.currentTimeMillis());
        orderRequest.put("payment_capture", 1);

        Order order = razorpayClient.orders.create(orderRequest);
        return convertToResponse(order);
    }

    private RazorpayOrderResponse convertToResponse(Order order) {

        java.util.Date date = (java.util.Date) order.get("created_at");
        Long timestamp = date.getTime(); // convert Date to milliseconds

        return RazorpayOrderResponse.builder()
                .id(order.get("id").toString())
                .entity(order.get("entity").toString())
                .amount(Integer.valueOf(order.get("amount").toString()))
                .currency(order.get("currency").toString())
                .status(order.get("status").toString())
                .created_at(timestamp)
                .receipt(order.get("receipt").toString())
                .build();
    }

}
