package com.eatorbit.backend.repository;

import com.eatorbit.backend.model.FoodCategory;
import com.eatorbit.backend.model.FoodItem;
import com.eatorbit.backend.model.Outlet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByOutlet(Outlet outlet);

    List<FoodItem> findByCategory(FoodCategory category);
}
