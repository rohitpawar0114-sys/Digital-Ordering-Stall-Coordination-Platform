package com.eatorbit.backend.dto;

import java.util.List;

public class CartItemRequest {
    private Long foodId;
    private Integer quantity;
    private List<String> selectedIngredients;

    public CartItemRequest() {
    }

    public Long getFoodId() {
        return foodId;
    }

    public void setFoodId(Long foodId) {
        this.foodId = foodId;
    }

    // Alias for frontend compatibility
    public void setFoodItemId(Long foodItemId) {
        this.foodId = foodItemId;
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
}
