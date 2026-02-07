package com.eatorbit.backend.dto;

import com.eatorbit.backend.model.PaymentMethod;

public class OrderRequest {
    private PaymentMethod paymentMethod;

    public OrderRequest() {
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
