package com.placement.tracker.dto;

public class NotesRequest {
    private String notes;

    public NotesRequest() {}
    public NotesRequest(String notes) { this.notes = notes; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
