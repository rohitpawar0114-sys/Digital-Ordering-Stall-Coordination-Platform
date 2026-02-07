package com.eatorbit.backend.controller;

import com.eatorbit.backend.model.Subscriber;
import com.eatorbit.backend.repository.SubscriberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final SubscriberRepository subscriberRepository;

    public PublicController(SubscriberRepository subscriberRepository) {
        this.subscriberRepository = subscriberRepository;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (subscriberRepository.existsByEmail(email)) {
            return ResponseEntity.ok(Map.of("message", "You are already subscribed!"));
        }

        Subscriber subscriber = new Subscriber();
        subscriber.setEmail(email);
        subscriberRepository.save(subscriber);

        return ResponseEntity.ok(Map.of("message", "Thank you for subscribing!"));
    }
}
