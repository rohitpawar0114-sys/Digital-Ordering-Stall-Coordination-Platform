package com.eatorbit.backend.repository;

import com.eatorbit.backend.model.Outlet;
import com.eatorbit.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OutletRepository extends JpaRepository<Outlet, Long> {
    List<Outlet> findByOwner(User owner);
}
