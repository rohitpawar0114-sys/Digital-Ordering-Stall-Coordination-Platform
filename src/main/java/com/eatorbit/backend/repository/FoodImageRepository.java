package com.eatorbit.backend.repository;

import com.eatorbit.backend.model.FoodImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodImageRepository extends JpaRepository<FoodImage, Long> {
}
