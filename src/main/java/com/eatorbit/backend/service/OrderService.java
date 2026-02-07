package com.eatorbit.backend.service;

import com.eatorbit.backend.dto.OrderItemDto;
import com.eatorbit.backend.dto.OrderRequest;
import com.eatorbit.backend.dto.OrderResponse;
import com.eatorbit.backend.exception.ApiException;
import com.eatorbit.backend.exception.ResourceNotFoundException;
import com.eatorbit.backend.model.*;
import com.eatorbit.backend.repository.CartRepository;
import com.eatorbit.backend.repository.OrderRepository;
import com.eatorbit.backend.repository.OutletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;//Save & fetch orders
    private final CartRepository cartRepository; //Get customer cart
    private final CartService cartService;//Clear cart after order
    private final OutletRepository outletRepository;//Validate outlet
    private final EmailService emailService;//Send confirmation email

    public OrderService(OrderRepository orderRepository, CartRepository cartRepository, CartService cartService,
            OutletRepository outletRepository, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartService = cartService;
        this.outletRepository = outletRepository;
        this.emailService = emailService;
    }

    @Transactional
    public OrderResponse placeOrder(OrderRequest request, User customer) {
        System.out.println("DEBUG: Placing order for customer: " + customer.getEmail());
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new ApiException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new ApiException("Cart is empty");
        }

        if (cart.getOutlet() == null) {
            throw new ApiException("Cart outlet information is missing. Please clear your cart and try again.");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setOutlet(cart.getOutlet());
        order.setTokenNumber(generateToken());
        order.setStatus(OrderStatus.PLACED);
        order.setTotalAmount(cart.getTotalAmount());
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.UPI);

        System.out.println("DEBUG: Created order shell. Items in cart: " + cart.getItems().size());

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setFood(cartItem.getFood());
            item.setQuantity(cartItem.getQuantity());
            // Create a new list for ingredients to avoid sharing reference with CartItem
            if (cartItem.getSelectedIngredients() != null) {
                item.setSelectedIngredients(new ArrayList<>(cartItem.getSelectedIngredients()));
            }
            item.setTotalPrice(cartItem.getTotalPrice());
            return item;
        }).collect(Collectors.toList());

        order.setItems(orderItems);

        try {
            Order savedOrder = orderRepository.saveAndFlush(order);
            System.out.println("DEBUG: Order saved with ID: " + savedOrder.getOrderId());

            // Send email confirmation asynchronously
            try {
                emailService.sendOrderConfirmation(savedOrder);
            } catch (Exception e) {
                System.err.println("WARNING: Failed to trigger email service: " + e.getMessage());
                // Don't fail the order if email fails
            }

            cartService.clearCart(cart);
            return mapToDto(savedOrder);
        } catch (Exception e) {
            System.err.println("ERROR: Failed to save order: " + e.getMessage());
            e.printStackTrace();
            throw new ApiException("Could not complete order. Please contact support. Error: " + e.getMessage());
        }
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return mapToDto(order);
    }

    public OrderResponse trackOrderByToken(String token) {
        Order order = orderRepository.findByTokenNumber(token)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return mapToDto(order);
    }

    public List<OrderResponse> getOrdersByOutlet(Long outletId) {
        Outlet outlet = outletRepository.findById(outletId)
                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found"));
        return orderRepository.findByOutlet(outlet).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());//Outlet Owner dashboard
    }
  
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        return mapToDto(orderRepository.save(order));//Changes status like PREPARING, READY, COMPLETED
    }

    public List<OrderResponse> getOrdersByCustomer(User customer) {
        return orderRepository.findByCustomer(customer).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());//Customer dashboard
    }

    private String generateToken() {
        return "TKN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();//generated random token
    }

    private OrderResponse mapToDto(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setTokenNumber(order.getTokenNumber());
        response.setOutletName(order.getOutlet().getOutletName());
        response.setStatus(order.getStatus());
        response.setTotalAmount(order.getTotalAmount());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setCreatedAt(order.getCreatedAt());

        List<OrderItemDto> itemDtos = order.getItems().stream().map(item -> {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setFoodName(item.getFood().getFoodName());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setSelectedIngredients(item.getSelectedIngredients());
            itemDto.setTotalPrice(item.getTotalPrice());
            return itemDto;
        }).collect(Collectors.toList());

        response.setItems(itemDtos);
        return response;
    }
}
