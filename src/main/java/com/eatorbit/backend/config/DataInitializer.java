package com.eatorbit.backend.config;

import com.eatorbit.backend.model.Role;
import com.eatorbit.backend.model.User;
import com.eatorbit.backend.model.UserStatus;
import com.eatorbit.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create hardcoded admin if not exists
        String adminEmail = "abc@gmail.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setFullName("Default Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("123"));
            admin.setRole(Role.ADMIN);
            admin.setStatus(UserStatus.ACTIVE);

            userRepository.save(admin);
            System.out.println("✅ Hardcoded Admin user created: " + adminEmail);
        } else {
            // Update password just in case it was changed but user wants reset to hardcoded
            User admin = userRepository.findByEmail(adminEmail).get();
            admin.setPassword(passwordEncoder.encode("123"));
            admin.setRole(Role.ADMIN); // Ensure role is ADMIN
            admin.setStatus(UserStatus.ACTIVE); // Ensure status is ACTIVE
            userRepository.save(admin);
            System.out.println("🔄 Hardcoded Admin user already exists, updated password and role.");
        }
    }
}
