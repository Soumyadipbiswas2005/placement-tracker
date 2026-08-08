package com.placement.tracker.dto;

public class TopicCreateRequest {

    private String name;
    private String category;
    private String subcategory;

    public TopicCreateRequest() {}

    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getSubcategory() { return subcategory; }

    public void setName(String name) { this.name = name; }
    public void setCategory(String category) { this.category = category; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }
}
