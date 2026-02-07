package com.eatorbit.backend.controller;

import com.eatorbit.backend.dto.CategoryRequest;
import com.eatorbit.backend.dto.FoodItemDto;
import com.eatorbit.backend.dto.OutletDto;
import com.eatorbit.backend.model.FoodCategory;
import com.eatorbit.backend.model.User;
import com.eatorbit.backend.service.MenuService;
import com.eatorbit.backend.service.OutletService;
import com.eatorbit.backend.service.OrderService;
import com.eatorbit.backend.model.OrderStatus;
import com.eatorbit.backend.dto.OrderResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import com.eatorbit.backend.exception.ApiException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner")
@PreAuthorize("hasRole('OUTLET_OWNER')")
public class OwnerController {

    private final OutletService outletService;
    private final MenuService menuService;
    private final OrderService orderService;

    public OwnerController(OutletService outletService, MenuService menuService, OrderService orderService) {
        this.outletService = outletService;
        this.menuService = menuService;
        this.orderService = orderService;
    }

    @PostMapping("/outlets")
    public ResponseEntity<OutletDto> createOutlet(@RequestBody OutletDto dto, @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(outletService.createOutlet(dto, owner));
    }

    @GetMapping("/outlets")
    public ResponseEntity<List<OutletDto>> getMyOutlets(@AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(outletService.getMyOutlets(owner));
    }

    @PutMapping("/outlets/{id}")
    public ResponseEntity<OutletDto> updateOutlet(@PathVariable Long id, @RequestBody OutletDto dto,
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(outletService.updateOutlet(id, dto, owner));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<FoodCategory>> getCategories(@RequestParam Long outletId) {
        return ResponseEntity.ok(menuService.getCategories(outletId));
    }

    @PostMapping("/categories")
    public ResponseEntity<FoodCategory> createCategory(@RequestBody CategoryRequest request) {
        return ResponseEntity.ok(menuService.createCategory(request.getOutletId(), request.getName()));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        menuService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/foods")
    public ResponseEntity<List<FoodItemDto>> getFoods(@RequestParam Long outletId) {
        return ResponseEntity.ok(menuService.getMenu(outletId));
    }

    @PostMapping("/foods")
    public ResponseEntity<FoodItemDto> createFoodItem(@RequestBody FoodItemDto dto) {
        return ResponseEntity.ok(menuService.createFoodItem(dto));
    }

    @PutMapping("/foods/{id}")
    public ResponseEntity<FoodItemDto> updateFoodItem(@PathVariable Long id, @RequestBody FoodItemDto dto) {
        return ResponseEntity.ok(menuService.updateFoodItem(id, dto));
    }

    @DeleteMapping("/foods/{id}")
    public ResponseEntity<Void> deleteFoodItem(@PathVariable Long id) {
        menuService.deleteFoodItem(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/upi-qr")
    public ResponseEntity<Map<String, String>> getUpiQr(@RequestParam Long outletId) {
        OutletDto outlet = outletService.getOutletById(outletId);
        return ResponseEntity.ok(Map.of("qrImageUrl", outlet.getQrImageUrl() != null ? outlet.getQrImageUrl() : ""));
    }

    @PostMapping("/upi-qr")
    public ResponseEntity<Void> uploadUpiQr(@RequestParam("qrImage") MultipartFile file,
            @AuthenticationPrincipal User owner) {
        List<OutletDto> outlets = outletService.getMyOutlets(owner);
        if (outlets.isEmpty()) {
            throw new ApiException("No outlet assigned to this owner");
        }

        // Simulate file upload - in real app, save to disk/cloud and get URL
        // We'll use the outletId to make the mock URL unique
        Long outletId = outlets.get(0).getOutletId();
        String mockUrl = "https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=EatOrbitPayment_" + outletId;
        outletService.updateQrCode(outletId, mockUrl);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getOrders(@RequestParam Long outletId) {
        return ResponseEntity.ok(orderService.getOrdersByOutlet(outletId));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id,
            @RequestBody Map<String, String> body) {
        OrderStatus status = OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
