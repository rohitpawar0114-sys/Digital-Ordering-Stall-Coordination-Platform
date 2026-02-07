package com.eatorbit.backend.repository;

import com.eatorbit.backend.model.IngredientItem;
import com.eatorbit.backend.model.Outlet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientItemRepository extends JpaRepository<IngredientItem, Long> {
    List<IngredientItem> findByCategoryOutlet(Outlet outlet);
}
