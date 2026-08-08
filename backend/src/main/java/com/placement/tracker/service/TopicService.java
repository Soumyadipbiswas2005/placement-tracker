package com.placement.tracker.service;

import com.placement.tracker.dto.StatsResponse;
import com.placement.tracker.entity.Topic;
import com.placement.tracker.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TopicService {

    private final TopicRepository topicRepository;

    public TopicService(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    public List<Topic> getAllTopics() {
        return topicRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Topic getTopicById(Long id) {
        return topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));
    }

    public Topic toggleCompletion(Long id) {
        Topic topic = getTopicById(id);
        if (topic.isCompleted()) {
            topic.setCompleted(false);
            topic.setCompletedAt(null);
        } else {
            topic.setCompleted(true);
            topic.setCompletedAt(LocalDateTime.now());
        }
        return topicRepository.save(topic);
    }

    public Topic updateNotes(Long id, String notes) {
        Topic topic = getTopicById(id);
        topic.setNotes(notes);
        return topicRepository.save(topic);
    }

    @Transactional(readOnly = true)
    public StatsResponse getStats() {
        long total = topicRepository.count();
        long completed = topicRepository.countByCategoryAndCompleted("", true);

        // Get all categories and compute stats per category
        List<String> categories = topicRepository.findDistinctCategories();
        List<StatsResponse.CategoryStat> categoryStats = categories.stream().map(cat -> {
            long catTotal = topicRepository.countByCategory(cat);
            long catCompleted = topicRepository.countByCategoryAndCompleted(cat, true);
            return new StatsResponse.CategoryStat(cat, catTotal, catCompleted);
        }).collect(Collectors.toList());

        // Recalculate total completed properly
        long totalCompleted = categoryStats.stream().mapToLong(StatsResponse.CategoryStat::getCompleted).sum();

        return new StatsResponse(total, totalCompleted, categoryStats);
    }
}
