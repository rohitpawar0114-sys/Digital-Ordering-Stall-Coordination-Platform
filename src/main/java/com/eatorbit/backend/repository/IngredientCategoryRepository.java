package com.eatorbit.backend.repository;

import com.eatorbit.backend.model.IngredientCategory;
import com.eatorbit.backend.model.Outlet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientCategoryRepository extends JpaRepository<IngredientCategory, Long> {
    List<IngredientCategory> findByOutlet(Outlet outlet);
}
