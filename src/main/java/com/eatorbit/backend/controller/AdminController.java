package com.eatorbit.backend.controller;

import com.eatorbit.backend.dto.OutletDto;
import com.eatorbit.backend.exception.ApiException;
import com.eatorbit.backend.exception.ResourceNotFoundException;
import com.eatorbit.backend.model.Role;
import com.eatorbit.backend.model.Subscriber;
import com.eatorbit.backend.model.User;
import com.eatorbit.backend.repository.SubscriberRepository;
import com.eatorbit.backend.repository.UserRepository;
import com.eatorbit.backend.service.OutletService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final OutletService outletService;
    private final SubscriberRepository subscriberRepository;

    public AdminController(UserRepository userRepository, OutletService outletService,
            SubscriberRepository subscriberRepository) {
        this.userRepository = userRepository;
        this.outletService = outletService;
        this.subscriberRepository = subscriberRepository;
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/pending-vendors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getPendingVendors() {
        List<User> pendingVendors = userRepository.findByRoleAndStatus(Role.OUTLET_OWNER,
                com.eatorbit.backend.model.UserStatus.PENDING);
        return ResponseEntity.ok(pendingVendors);
    }

    @PostMapping("/vendors/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> approveVendor(@PathVariable Long id) {
        User vendor = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));

        if (vendor.getRole() != Role.OUTLET_OWNER) {
            throw new ApiException("User is not a vendor");
        }

        vendor.setStatus(com.eatorbit.backend.model.UserStatus.ACTIVE);
        User updated = userRepository.save(vendor);

        return ResponseEntity.ok(updated);
    }

    @PostMapping("/vendors/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> rejectVendor(@PathVariable Long id) {
        User vendor = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));

        if (vendor.getRole() != Role.OUTLET_OWNER) {
            throw new ApiException("User is not a vendor");
        }

        vendor.setStatus(com.eatorbit.backend.model.UserStatus.REJECTED);
        User updated = userRepository.save(vendor);

        return ResponseEntity.ok(updated);
    }

    @GetMapping("/outlets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OutletDto>> getAllOutlets() {
        return ResponseEntity.ok(outletService.getAllOutlets());
    }

    @PostMapping("/outlets")
    public ResponseEntity<OutletDto> createOutlet(@RequestBody OutletDto dto) {
        if (dto.getOwnerId() == null) {
            throw new RuntimeException("Owner ID is required");
        }
        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return ResponseEntity.ok(outletService.createOutlet(dto, owner));
    }

    @PutMapping("/outlets/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OutletDto> updateOutlet(@PathVariable Long id, @RequestBody OutletDto dto) {
        if (dto.getOwnerId() == null) {
            throw new RuntimeException("Owner ID is required");
        }
        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return ResponseEntity.ok(outletService.updateOutletByAdmin(id, dto, owner));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/outlets/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOutlet(@PathVariable Long id) {
        outletService.deleteOutlet(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Object>> getAllOrders() {
        return ResponseEntity.ok(java.util.Collections.emptyList());
    }

    @GetMapping("/subscribers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Subscriber>> getAllSubscribers() {
        return ResponseEntity.ok(subscriberRepository.findAll());
    }
}
