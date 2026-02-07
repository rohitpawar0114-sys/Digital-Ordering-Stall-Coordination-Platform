package com.eatorbit.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class OrderResponse {
    private Long orderId;
    private String tokenNumber;
    private String outletName;
    private com.eatorbit.backend.model.OrderStatus status;
    private BigDecimal totalAmount;
    private com.eatorbit.backend.model.PaymentStatus paymentStatus;
    private java.time.LocalDateTime createdAt;
    private List<OrderItemDto> items;

    public OrderResponse() {
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getTokenNumber() {
        return tokenNumber;
    }

    public void setTokenNumber(String tokenNumber) {
        this.tokenNumber = tokenNumber;
    }

    public String getOutletName() {
        return outletName;
    }

    public void setOutletName(String outletName) {
        this.outletName = outletName;
    }

    public com.eatorbit.backend.model.OrderStatus getStatus() {
        return status;
    }

    public void setStatus(com.eatorbit.backend.model.OrderStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public com.eatorbit.backend.model.PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(com.eatorbit.backend.model.PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }
}
