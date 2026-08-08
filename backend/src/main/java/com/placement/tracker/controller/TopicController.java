package com.placement.tracker.controller;

import com.placement.tracker.dto.NotesRequest;
import com.placement.tracker.dto.StatsResponse;
import com.placement.tracker.entity.Topic;
import com.placement.tracker.service.TopicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    /** GET /api/topics — return all topics ordered by displayOrder */
    @GetMapping("/topics")
    public ResponseEntity<List<Topic>> getAllTopics() {
        return ResponseEntity.ok(topicService.getAllTopics());
    }

    /* Adding something new for dummy */
    @PostMapping("/topics")
    public ResponseEntity<List<Topic>> getAllTopicsByPost() {
        return ResponseEntity.ok(topicService.getAllTopics());
    }

    /** GET /api/topics/{id} — return single topic */
    @GetMapping("/topics/{id}")
    public ResponseEntity<Topic> getTopic(@PathVariable Long id) {
        return ResponseEntity.ok(topicService.getTopicById(id));
    }

    /**
     * PUT /api/topics/{id}/toggle — toggle completion and record/clear timestamp
     */
    @PutMapping("/topics/{id}/toggle")
    public ResponseEntity<Topic> toggleTopic(@PathVariable Long id) {
        return ResponseEntity.ok(topicService.toggleCompletion(id));
    }

    /** PUT /api/topics/{id}/notes — update personal notes */
    @PutMapping("/topics/{id}/notes")
    public ResponseEntity<Topic> updateNotes(
            @PathVariable Long id,
            @RequestBody NotesRequest request) {
        return ResponseEntity.ok(topicService.updateNotes(id, request.getNotes()));
    }

    /** GET /api/stats — return overall and per-category completion stats */
    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        return ResponseEntity.ok(topicService.getStats());
    }
}
