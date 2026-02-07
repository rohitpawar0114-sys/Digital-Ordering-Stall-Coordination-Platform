package com.eatorbit.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Long cartItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id", nullable = false)
    private FoodItem food;

    @Column(nullable = false)
    private Integer quantity;

    @ElementCollection
    @CollectionTable(name = "cart_item_ingredients", joinColumns = @JoinColumn(name = "cart_item_id"))
    @Column(name = "ingredient_name")
    private List<String> selectedIngredients;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    public CartItem() {
    }

    public Long getCartItemId() {
        return cartItemId;
    }

    public void setCartItemId(Long cartItemId) {
        this.cartItemId = cartItemId;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public FoodItem getFood() {
        return food;
    }

    public void setFood(FoodItem food) {
        this.food = food;
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
