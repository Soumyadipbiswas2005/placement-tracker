package com.placement.tracker.dto;

import java.util.List;

public class StatsResponse {

    private long totalTopics;
    private long completedTopics;
    private double overallPercentage;
    private List<CategoryStat> categoryStats;

    public StatsResponse(long total, long completed, List<CategoryStat> categoryStats) {
        this.totalTopics = total;
        this.completedTopics = completed;
        this.overallPercentage = total > 0 ? Math.round((completed * 100.0 / total) * 10) / 10.0 : 0;
        this.categoryStats = categoryStats;
    }

    // ── Getters ──────────────────────────────────────────────────────────────
    public long getTotalTopics() { return totalTopics; }
    public long getCompletedTopics() { return completedTopics; }
    public double getOverallPercentage() { return overallPercentage; }
    public List<CategoryStat> getCategoryStats() { return categoryStats; }

    // ── Nested DTO ───────────────────────────────────────────────────────────
    public static class CategoryStat {
        private String category;
        private long total;
        private long completed;
        private double percentage;

        public CategoryStat(String category, long total, long completed) {
            this.category = category;
            this.total = total;
            this.completed = completed;
            this.percentage = total > 0 ? Math.round((completed * 100.0 / total) * 10) / 10.0 : 0;
        }

        public String getCategory() { return category; }
        public long getTotal() { return total; }
        public long getCompleted() { return completed; }
        public double getPercentage() { return percentage; }
    }
}
