package com.eatorbit.backend.repository;

import com.eatorbit.backend.model.Cart;
import com.eatorbit.backend.model.Outlet;
import com.eatorbit.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByCustomer(User customer);

    List<Cart> findByOutlet(Outlet outlet);
}
