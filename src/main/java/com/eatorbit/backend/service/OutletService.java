package com.eatorbit.backend.service;

import com.eatorbit.backend.dto.OutletDto;
import com.eatorbit.backend.exception.ApiException;
import com.eatorbit.backend.exception.ResourceNotFoundException;
import com.eatorbit.backend.model.Outlet;
import com.eatorbit.backend.model.User;
import com.eatorbit.backend.model.FoodItem;
import com.eatorbit.backend.model.FoodCategory;
import com.eatorbit.backend.model.Order;
import com.eatorbit.backend.model.Cart;
import com.eatorbit.backend.model.IngredientCategory;
import com.eatorbit.backend.model.Event;
import com.eatorbit.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OutletService {

    private final OutletRepository outletRepository;
    private final FoodItemRepository foodItemRepository;
    private final FoodCategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final IngredientCategoryRepository ingredientCategoryRepository;
    private final EventRepository eventRepository;

    public OutletService(OutletRepository outletRepository, FoodItemRepository foodItemRepository,
            FoodCategoryRepository categoryRepository, OrderRepository orderRepository,
            CartRepository cartRepository, IngredientCategoryRepository ingredientCategoryRepository,
            EventRepository eventRepository) {
        this.outletRepository = outletRepository;
        this.foodItemRepository = foodItemRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.ingredientCategoryRepository = ingredientCategoryRepository;
        this.eventRepository = eventRepository;
    }

    public OutletDto createOutlet(OutletDto dto, User owner) {
        Outlet outlet = new Outlet();
        outlet.setOwner(owner);
        outlet.setOutletName(dto.getOutletName());
        outlet.setDescription(dto.getDescription());
        outlet.setCuisineType(dto.getCuisineType());
        outlet.setOpeningHours(dto.getOpeningHours());
        outlet.setOpen(dto.isOpen());
        outlet.setImageUrl(dto.getImageUrl());

        outlet = outletRepository.save(outlet);
        return mapToDto(outlet);
    }

    public List<OutletDto> getMyOutlets(User owner) {
        return outletRepository.findByOwner(owner).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<OutletDto> getAllOutlets() {
        return outletRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public OutletDto getOutletById(Long id) {
        Outlet outlet = outletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found"));
        return mapToDto(outlet);
    }

    public OutletDto updateOutlet(Long id, OutletDto dto, User owner) {
        Outlet outlet = outletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found"));

        if (!outlet.getOwner().getUserId().equals(owner.getUserId())) {
            throw new ApiException("You don't own this outlet");
        }

        outlet.setOutletName(dto.getOutletName());
        outlet.setDescription(dto.getDescription());
        outlet.setCuisineType(dto.getCuisineType());
        outlet.setOpeningHours(dto.getOpeningHours());
        outlet.setOpen(dto.isOpen());
        outlet.setImageUrl(dto.getImageUrl());

        outlet = outletRepository.save(outlet);
        return mapToDto(outlet);
    }

    public OutletDto updateOutletByAdmin(Long id, OutletDto dto, User owner) {
        Outlet outlet = outletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found"));

        outlet.setOwner(owner); // Reset owner as assigned by admin
        outlet.setOutletName(dto.getOutletName());
        outlet.setDescription(dto.getDescription());
        outlet.setCuisineType(dto.getCuisineType());
        outlet.setOpeningHours(dto.getOpeningHours());
        outlet.setOpen(dto.isOpen());
        outlet.setImageUrl(dto.getImageUrl());

        outlet = outletRepository.save(outlet);
        return mapToDto(outlet);
    }

    public void updateQrCode(Long outletId, String qrUrl) {
        Outlet outlet = outletRepository.findById(outletId)
                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found"));
        outlet.setQrImageUrl(qrUrl);
        outletRepository.save(outlet);
    }

    @Transactional
    public void deleteOutlet(Long id) {
        Outlet outlet = outletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found"));

        // 1. Delete Carts related to this outlet
        List<Cart> carts = cartRepository.findByOutlet(outlet);
        cartRepository.deleteAll(carts);

        // 2. Delete Orders related to this outlet (Cascades to OrderItems)
        List<Order> orders = orderRepository.findByOutlet(outlet);
        orderRepository.deleteAll(orders);

        // 3. Delete FoodItems (Cascades to FoodImages and food_ingredient join table)
        List<FoodItem> items = foodItemRepository.findByOutlet(outlet);
        foodItemRepository.deleteAll(items);

        // 4. Delete FoodCategories
        List<FoodCategory> categories = categoryRepository.findByOutlet(outlet);
        categoryRepository.deleteAll(categories);

        // 5. Delete IngredientCategories (Cascades to IngredientItems)
        List<IngredientCategory> ingredientCategories = ingredientCategoryRepository.findByOutlet(outlet);
        ingredientCategoryRepository.deleteAll(ingredientCategories);

        // 6. Delete Events
        List<Event> events = eventRepository.findByOutlet(outlet);
        eventRepository.deleteAll(events);

        // 7. Finally delete the outlet
        outletRepository.delete(outlet);
    }

    private OutletDto mapToDto(Outlet outlet) {
        OutletDto dto = new OutletDto();
        dto.setOutletId(outlet.getOutletId());
        dto.setOutletName(outlet.getOutletName());
        dto.setDescription(outlet.getDescription());
        dto.setCuisineType(outlet.getCuisineType());
        dto.setOpeningHours(outlet.getOpeningHours());
        dto.setOpen(outlet.isOpen());
        dto.setImageUrl(outlet.getImageUrl());
        dto.setQrImageUrl(outlet.getQrImageUrl());
        if (outlet.getOwner() != null) {
            dto.setOwnerId(outlet.getOwner().getUserId());
            dto.setOwnerName(outlet.getOwner().getFullName());
            dto.setOwnerEmail(outlet.getOwner().getEmail());
        }
        return dto;
    }
}
