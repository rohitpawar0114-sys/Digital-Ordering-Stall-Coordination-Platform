package com.eatorbit.backend.service;

import com.eatorbit.backend.dto.CartDto;
import com.eatorbit.backend.dto.CartItemDto;
import com.eatorbit.backend.dto.CartItemRequest;
import com.eatorbit.backend.exception.ApiException;
import com.eatorbit.backend.exception.ResourceNotFoundException;
import com.eatorbit.backend.model.*;
import com.eatorbit.backend.repository.CartRepository;
import com.eatorbit.backend.repository.FoodItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final FoodItemRepository foodItemRepository;

    public CartService(CartRepository cartRepository,
            FoodItemRepository foodItemRepository) {
        this.cartRepository = cartRepository;
        this.foodItemRepository = foodItemRepository;
    }

    @Transactional //Add a food item to customer’s cart, ensuring outlet consistency.
    public CartDto addItemToCart(CartItemRequest request, User customer) {
        FoodItem food = foodItemRepository.findById(request.getFoodId())
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found"));
        																						
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    newCart.setOutlet(food.getOutlet());
                    newCart.setTotalAmount(BigDecimal.ZERO);
                    newCart.setItems(new ArrayList<>());
                    return cartRepository.save(newCart);
                });

        // Check if cart belongs to the same outlet
        if (cart.getOutlet() == null || cart.getItems().isEmpty()) {
            cart.setOutlet(food.getOutlet());
        } else if (!cart.getOutlet().getOutletId().equals(food.getOutlet().getOutletId())) {
            // Option: Clear cart if switching outlets, or throw error
            // For now, let's clear it to allow ordering from a new outlet
            clearCart(cart);
            cart.setOutlet(food.getOutlet());
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getFood().getFoodId().equals(food.getFoodId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setTotalPrice(food.getPrice().multiply(new BigDecimal(item.getQuantity())));
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setFood(food);
            item.setQuantity(request.getQuantity());
            item.setSelectedIngredients(request.getSelectedIngredients());
            item.setTotalPrice(food.getPrice().multiply(new BigDecimal(request.getQuantity())));
            cart.getItems().add(item);
        }

        updateCartTotal(cart);
        Cart savedCart = cartRepository.save(cart);
        return mapToDto(savedCart);
    }

    @Transactional
    public CartDto removeItemFromCart(Long itemId, User customer) {
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new ApiException("Cart not found"));

        cart.getItems().removeIf(item -> item.getCartItemId().equals(itemId));

        updateCartTotal(cart);
        Cart savedCart = cartRepository.save(cart);
        return mapToDto(savedCart);
    }

    public CartDto getCart(User customer) {
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        return mapToDto(cart);
    }

    @Transactional
    public void clearCart(Cart cart) {
        System.out.println("DEBUG: Clearing cart for ID: " + cart.getCartId());
        // Clear items list (orphanRemoval will delete them)
        cart.getItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        // Note: We don't set outlet to null anymore to avoid "Column 'outlet_id' cannot
        // be null" DB constraints.
        // The outlet will be updated automatically next time the user adds an item when
        // the cart is empty.
        cartRepository.save(cart);
        cartRepository.flush();
        System.out.println("DEBUG: Cart cleared successfully.");
    }

    private void updateCartTotal(Cart cart) {
        BigDecimal total = cart.getItems().stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
    }

    private CartDto mapToDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setCartId(cart.getCartId());
        if (cart.getOutlet() != null) {
            dto.setOutletId(cart.getOutlet().getOutletId());
        }
        dto.setTotalAmount(cart.getTotalAmount());
        dto.setItems(cart.getItems().stream().map(item -> {
            CartItemDto itemDto = new CartItemDto();
            itemDto.setCartItemId(item.getCartItemId());
            itemDto.setFoodName(item.getFood().getFoodName());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setSelectedIngredients(item.getSelectedIngredients());
            itemDto.setTotalPrice(item.getTotalPrice());
            return itemDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
