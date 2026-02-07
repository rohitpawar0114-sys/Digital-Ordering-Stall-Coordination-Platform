package com.eatorbit.backend.repository;

import com.eatorbit.backend.model.Event;
import com.eatorbit.backend.model.Outlet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOutlet(Outlet outlet);
}
