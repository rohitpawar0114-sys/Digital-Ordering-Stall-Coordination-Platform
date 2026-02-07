package com.eatorbit.backend.service;

import com.eatorbit.backend.dto.AuthRequest;
import com.eatorbit.backend.dto.AuthResponse;
import com.eatorbit.backend.exception.ApiException;
import com.eatorbit.backend.model.Role;
import com.eatorbit.backend.model.User;
import com.eatorbit.backend.repository.UserRepository;
import com.eatorbit.backend.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtils jwtUtils;
        private final AuthenticationManager authenticationManager;

        public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                        JwtUtils jwtUtils, AuthenticationManager authenticationManager) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtUtils = jwtUtils;
                this.authenticationManager = authenticationManager;
        }

        public AuthResponse register(AuthRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new ApiException("Email already registered");
                }

                User user = new User();
                user.setFullName(request.getFullName());
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setRole(request.getRole());

                // Set status based on role
                if (user.getRole() == Role.OUTLET_OWNER) {
                        user.setStatus(com.eatorbit.backend.model.UserStatus.PENDING); // Vendors need approval
                } else {
                        user.setStatus(com.eatorbit.backend.model.UserStatus.ACTIVE); // Customers are active
                                                                                      // immediately
                }

                userRepository.save(user);
                String token = jwtUtils.generateToken(user);

                AuthResponse response = new AuthResponse();
                response.setToken(token);
                response.setEmail(user.getEmail());
                response.setFullName(user.getFullName());
                response.setRole(user.getRole());
                return response;
        }

        public AuthResponse login(AuthRequest request) {
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new ApiException("Invalid credentials"));

                // Check user status before authentication
                if (user.getStatus() != com.eatorbit.backend.model.UserStatus.ACTIVE) {
                        if (user.getStatus() == com.eatorbit.backend.model.UserStatus.PENDING) {
                                throw new ApiException("Your account is pending admin approval");
                        } else if (user.getStatus() == com.eatorbit.backend.model.UserStatus.REJECTED) {
                                throw new ApiException("Your account has been rejected");
                        } else if (user.getStatus() == com.eatorbit.backend.model.UserStatus.SUSPENDED) {
                                throw new ApiException("Your account has been suspended");
                        }
                }

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                String token = jwtUtils.generateToken(user);

                AuthResponse response = new AuthResponse();
                response.setToken(token);
                response.setEmail(user.getEmail());
                response.setFullName(user.getFullName());
                response.setRole(user.getRole());
                return response;
        }
}
