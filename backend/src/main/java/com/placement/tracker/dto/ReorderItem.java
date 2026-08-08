package com.placement.tracker.dto;

public class ReorderItem {

    private Long id;
    private int displayOrder;

    public ReorderItem() {}

    public Long getId() { return id; }
    public int getDisplayOrder() { return displayOrder; }

    public void setId(Long id) { this.id = id; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
}
