package com.eatorbit.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class OrderItemDto {
    private String foodName;
    private Integer quantity;
    private List<String> selectedIngredients;
    private BigDecimal totalPrice;

    public OrderItemDto() {
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public List<String> getSelectedIngredients() {
        return selectedIngredients;
    }

    public void setSelectedIngredients(List<String> selectedIngredients) {
        this.selectedIngredients = selectedIngredients;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}
