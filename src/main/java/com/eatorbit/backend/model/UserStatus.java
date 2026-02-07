package com.eatorbit.backend.model;

public enum UserStatus {
    PENDING, // Awaiting approval (for vendors)
    ACTIVE, // Approved and active
    REJECTED, // Rejected by admin
    SUSPENDED // Temporarily suspended
}
