package com.eatorbit.backend.repository;

import com.eatorbit.backend.model.FoodCategory;
import com.eatorbit.backend.model.Outlet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Long> {
    List<FoodCategory> findByOutlet(Outlet outlet);
}
