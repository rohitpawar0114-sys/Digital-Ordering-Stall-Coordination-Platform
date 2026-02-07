package com.eatorbit.backend.dto;

public class CategoryRequest {
    private Long outletId;
    private String name;

    public CategoryRequest() {
    }

    public Long getOutletId() {
        return outletId;
    }

    public void setOutletId(Long outletId) {
        this.outletId = outletId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
