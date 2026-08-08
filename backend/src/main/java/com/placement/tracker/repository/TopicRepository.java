package com.placement.tracker.repository;

import com.placement.tracker.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    List<Topic> findAllByOrderByDisplayOrderAsc();

    List<Topic> findByCategoryOrderByDisplayOrderAsc(String category);

    long countByCategory(String category);

    long countByCategoryAndCompleted(String category, boolean completed);

    @Query("SELECT t.category FROM Topic t GROUP BY t.category ORDER BY MIN(t.displayOrder)")
    List<String> findDistinctCategories();
}
