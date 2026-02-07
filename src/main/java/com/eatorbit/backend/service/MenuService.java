package com.eatorbit.backend.service;

import com.eatorbit.backend.dto.FoodItemDto;
import com.eatorbit.backend.exception.ResourceNotFoundException;
import com.eatorbit.backend.model.*;
import com.eatorbit.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService {

        private final FoodCategoryRepository categoryRepository;
        private final FoodItemRepository foodItemRepository;
        private final OutletRepository outletRepository;
        private final FoodImageRepository foodImageRepository;
        private final IngredientItemRepository ingredientItemRepository;

        public MenuService(FoodCategoryRepository categoryRepository, FoodItemRepository foodItemRepository,
                        OutletRepository outletRepository, FoodImageRepository foodImageRepository,
                        IngredientItemRepository ingredientItemRepository) {
                this.categoryRepository = categoryRepository;
                this.foodItemRepository = foodItemRepository;
                this.outletRepository = outletRepository;
                this.foodImageRepository = foodImageRepository;
                this.ingredientItemRepository = ingredientItemRepository;
        }

        public List<FoodCategory> getCategories(Long outletId) {
                Outlet outlet = outletRepository.findById(outletId)
                                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found"));
                return categoryRepository.findByOutlet(outlet);
        }

        public FoodCategory createCategory(Long outletId, String name) {
                Outlet outlet = outletRepository.findById(outletId)
                                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found"));
                FoodCategory category = new FoodCategory();
                category.setOutlet(outlet);
                category.setCategoryName(name);
                return categoryRepository.save(category);
        }

        public void deleteCategory(Long id) {
                FoodCategory category = categoryRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

                // First unassign from food items in this category if any
                List<FoodItem> items = foodItemRepository.findByCategory(category);

                for (FoodItem item : items) {
                        item.setCategory(null);
                        foodItemRepository.save(item);
                }

                categoryRepository.delete(category);
        }

        @Transactional
        public FoodItemDto createFoodItem(FoodItemDto dto) {
                Outlet outlet = outletRepository.findById(dto.getOutletId())
                                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found"));
                FoodCategory category = categoryRepository.findById(dto.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

                FoodItem foodItem = new FoodItem();
                foodItem.setOutlet(outlet);
                foodItem.setCategory(category);
                foodItem.setFoodName(dto.getFoodName());
                foodItem.setDescription(dto.getDescription());
                foodItem.setPrice(dto.getPrice());
                foodItem.setAvailable(dto.isAvailable());
                foodItem.setVeg(dto.isVeg());
                foodItem.setSeasonal(dto.isSeasonal());

                if (dto.getIngredientIds() != null) {
                        List<IngredientItem> ingredients = ingredientItemRepository.findAllById(dto.getIngredientIds());
                        foodItem.setIngredients(ingredients);
                }

                foodItem = foodItemRepository.save(foodItem);

                if (dto.getImageUrls() != null) {
                        for (String url : dto.getImageUrls()) {
                                FoodImage image = new FoodImage();
                                image.setFood(foodItem);
                                image.setImageUrl(url);
                                foodImageRepository.save(image);
                        }
                }

                return mapToDto(foodItem);
        }

        @Transactional
        public FoodItemDto updateFoodItem(Long id, FoodItemDto dto) {
                FoodItem foodItem = foodItemRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Food item not found"));

                foodItem.setFoodName(dto.getFoodName());
                foodItem.setDescription(dto.getDescription());
                foodItem.setPrice(dto.getPrice());
                foodItem.setAvailable(dto.isAvailable());
                foodItem.setVeg(dto.isVeg());
                foodItem.setSeasonal(dto.isSeasonal());

                if (dto.getCategoryId() != null) {
                        FoodCategory category = categoryRepository.findById(dto.getCategoryId())
                                        .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
                        foodItem.setCategory(category);
                }

                foodItem = foodItemRepository.save(foodItem);
                return mapToDto(foodItem);
        }

        public void deleteFoodItem(Long id) {
                if (!foodItemRepository.existsById(id)) {
                        throw new ResourceNotFoundException("Food item not found");
                }
                foodItemRepository.deleteById(id);
        }

        public List<FoodItemDto> getMenu(Long outletId) {
                Outlet outlet = outletRepository.findById(outletId)
                                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found"));
                return foodItemRepository.findByOutlet(outlet).stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        private FoodItemDto mapToDto(FoodItem item) {
                FoodItemDto dto = new FoodItemDto();
                dto.setFoodId(item.getFoodId());
                dto.setOutletId(item.getOutlet().getOutletId());
                dto.setCategoryId(item.getCategory().getCategoryId());
                dto.setFoodName(item.getFoodName());
                dto.setDescription(item.getDescription());
                dto.setPrice(item.getPrice());
                dto.setAvailable(item.isAvailable());
                dto.setVeg(item.isVeg());
                dto.setSeasonal(item.isSeasonal());
                dto.setImageUrls(item.getImages().stream().map(FoodImage::getImageUrl).collect(Collectors.toList()));
                dto.setIngredientIds(item.getIngredients().stream().map(IngredientItem::getIngredientId)
                                .collect(Collectors.toList()));
                return dto;
        }
}
