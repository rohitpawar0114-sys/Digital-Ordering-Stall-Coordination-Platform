package com.eatorbit.backend.controller;

import com.eatorbit.backend.dto.*;
import com.eatorbit.backend.model.User;
import com.eatorbit.backend.service.CartService;
import com.eatorbit.backend.service.MenuService;
import com.eatorbit.backend.service.OrderService;
import com.eatorbit.backend.service.OutletService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CustomerController {

    private final OutletService outletService;
    private final MenuService menuService;
    private final CartService cartService;
    private final OrderService orderService;

    public CustomerController(OutletService outletService, MenuService menuService,
            CartService cartService, OrderService orderService) {
        this.outletService = outletService;
        this.menuService = menuService;
        this.cartService = cartService;
        this.orderService = orderService;
    }

    @GetMapping("/outlets")
    public ResponseEntity<List<OutletDto>> getAllOutlets() {
        return ResponseEntity.ok(outletService.getAllOutlets());
    }

    @GetMapping("/outlets/{id}/menu")
    public ResponseEntity<List<FoodItemDto>> getMenu(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenu(id));
    }

    @PostMapping("/cart/add")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CartDto> addToCart(@RequestBody CartItemRequest request,
            @AuthenticationPrincipal User customer) {
        return ResponseEntity.ok(cartService.addItemToCart(request, customer));
    }

    @GetMapping("/cart")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CartDto> getCart(@AuthenticationPrincipal User customer) {
        return ResponseEntity.ok(cartService.getCart(customer));
    }

    @DeleteMapping("/cart/item/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CartDto> removeFromCart(@PathVariable Long id, @AuthenticationPrincipal User customer) {
        return ResponseEntity.ok(cartService.removeItemFromCart(id, customer));
    }

    @PostMapping("/order/place")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest request,
            @AuthenticationPrincipal User customer) {
        return ResponseEntity.ok(orderService.placeOrder(request, customer));
    }

    @GetMapping("/order/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/order/track/{token}")
    public ResponseEntity<OrderResponse> trackOrder(@PathVariable String token) {
        return ResponseEntity.ok(orderService.trackOrderByToken(token));
    }

    @GetMapping("/customer/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal User customer) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customer));
    }
}
