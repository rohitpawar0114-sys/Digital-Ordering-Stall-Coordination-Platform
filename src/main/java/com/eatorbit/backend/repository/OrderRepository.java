package com.eatorbit.backend.repository;

import com.eatorbit.backend.model.Order;
import com.eatorbit.backend.model.Outlet;
import com.eatorbit.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomer(User customer);

    Optional<Order> findByTokenNumber(String tokenNumber);

    List<Order> findByOutlet(Outlet outlet);
}
