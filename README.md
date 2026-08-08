# 🎯 Placement Prep Tracker

A full-stack web application to track your on-campus placement preparation progress — built with **Spring Boot**, **MySQL**, and **Vanilla JS/HTML/CSS**.

## ✨ Features

- ✅ **199 topics** from the "Ultimate On-Campus Placement Prep" PDF pre-loaded
- 📅 **Completion date badge** — recorded automatically when you check a topic
- 📊 **Animated progress rings** per category (Aptitude, Core CS, DSA, HR)
- 🔍 **Search & Filter** by topic name, status (done/pending)
- 📝 **Notes** — add personal notes/formulas per topic
- 🌙 **Dark/Light mode** toggle (preference saved in localStorage)
- 🎉 **Confetti burst** when you complete an entire category
- 📱 Fully **responsive** design

## 📂 Project Structure

```
backend/
├── pom.xml
└── src/main/
    ├── java/com/placement/tracker/
    │   ├── PlacementTrackerApplication.java  ← main + data seeder
    │   ├── entity/Topic.java
    │   ├── repository/TopicRepository.java
    │   ├── service/TopicService.java
    │   ├── controller/TopicController.java
    │   └── dto/
    │       ├── StatsResponse.java
    │       └── NotesRequest.java
    └── resources/
        ├── application.properties
        └── static/               ← Frontend served by Spring Boot
            ├── index.html
            ├── style.css
            └── app.js
```

## 🚀 How to Run

### Prerequisites
- Java 17+
- Maven 3.x
- MySQL 8.x (running on port 3306)

### 1. Configure Database
Edit `backend/src/main/resources/application.properties` if your MySQL password is not `root`:
```properties
spring.datasource.password=your_password
```

### 2. Start the Backend (with DevTools Hot-Reloading)
```bash
cd backend
mvn spring-boot:run
```

With `spring-boot-devtools` enabled:
- **Backend Java Changes**: Whenever you save/recompile Java files, Spring Boot automatically restarts in ~1 second.
- **Frontend Changes (HTML/CSS/JS)**: Static file changes under `src/main/resources/static/` are instantly visible upon refreshing the browser.


### 3. Open the App
Navigate to **http://localhost:8080** in your browser.

## 🔌 REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/topics` | Get all 199 topics |
| GET | `/api/topics/{id}` | Get a single topic |
| PUT | `/api/topics/{id}/toggle` | Toggle completion (sets/clears timestamp) |
| PUT | `/api/topics/{id}/notes` | Update personal notes |
| GET | `/api/stats` | Overall + per-category progress stats |

## 📚 Topics Covered

| Category | Subtopics | Count |
|----------|-----------|-------|
| **Aptitude** | Quantitative, Logical Reasoning, Verbal | 50 |
| **Core CS** | Computer Networks, DBMS, OOPs, OS | 71 |
| **Coding & DSA** | Programming, Data Structures, Algorithms, 30 Questions | 60 |
| **HR Interview** | Behavioural Questions | 18 |
| **Total** | | **199** |
