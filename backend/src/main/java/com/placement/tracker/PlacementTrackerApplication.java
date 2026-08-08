package com.placement.tracker;

import com.placement.tracker.entity.Topic;
import com.placement.tracker.repository.TopicRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class PlacementTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlacementTrackerApplication.class, args);
    }

    /**
     * Seeds the database with all topics from the PDF on first run.
     * Skips seeding if data already exists.
     */
    @Bean
    CommandLineRunner seedDatabase(TopicRepository repo) {
        return args -> {
            if (repo.count() > 0) {
                System.out.println("✅ Database already seeded. Skipping...");
                return;
            }
            System.out.println("🌱 Seeding placement prep topics...");
            repo.saveAll(buildTopics());
            System.out.println("✅ Seeded " + repo.count() + " topics successfully!");
        };
    }

    private List<Topic> buildTopics() {
        int order = 0;
        return Arrays.asList(

            // ═══════════════════════════════════════════════════════
            // CATEGORY: Aptitude
            // ═══════════════════════════════════════════════════════

            // Subcategory: Quantitative Aptitude
            new Topic("Number System",                   "Aptitude", "Quantitative Aptitude", order++),
            new Topic("HCF & LCM",                       "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Percentages",                     "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Profit & Loss",                   "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Simple Interest",                 "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Compound Interest",               "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Ratio & Proportion",              "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Averages",                        "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Time & Work",                     "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Time, Speed & Distance",          "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Pipes & Cisterns",                "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Mixtures & Alligation",           "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Permutation & Combination",       "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Probability",                     "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Algebra (Linear Equations)",      "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Quadratic Equations",             "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Logarithms",                      "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Geometry (Triangles, Circles)",   "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Mensuration (2D)",                "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Mensuration (3D)",                "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Data Interpretation – Tables",    "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Data Interpretation – Bar Graph", "Aptitude", "Quantitative Aptitude", order++),
            new Topic("Data Interpretation – Line Graph","Aptitude", "Quantitative Aptitude", order++),
            new Topic("Data Interpretation – Pie Chart", "Aptitude", "Quantitative Aptitude", order++),

            // Subcategory: Logical Reasoning
            new Topic("Number Series",                   "Aptitude", "Logical Reasoning", order++),
            new Topic("Alphabet Series",                 "Aptitude", "Logical Reasoning", order++),
            new Topic("Coding–Decoding",                 "Aptitude", "Logical Reasoning", order++),
            new Topic("Blood Relations",                 "Aptitude", "Logical Reasoning", order++),
            new Topic("Direction Sense",                 "Aptitude", "Logical Reasoning", order++),
            new Topic("Seating Arrangement",             "Aptitude", "Logical Reasoning", order++),
            new Topic("Floor-based Puzzles",             "Aptitude", "Logical Reasoning", order++),
            new Topic("Box-based Puzzles",               "Aptitude", "Logical Reasoning", order++),
            new Topic("Age-based Puzzles",               "Aptitude", "Logical Reasoning", order++),
            new Topic("Syllogisms",                      "Aptitude", "Logical Reasoning", order++),
            new Topic("Venn Diagrams",                   "Aptitude", "Logical Reasoning", order++),
            new Topic("Clocks",                          "Aptitude", "Logical Reasoning", order++),
            new Topic("Calendars",                       "Aptitude", "Logical Reasoning", order++),
            new Topic("Inequalities",                    "Aptitude", "Logical Reasoning", order++),
            new Topic("Input–Output",                    "Aptitude", "Logical Reasoning", order++),
            new Topic("Statement & Assumptions",         "Aptitude", "Logical Reasoning", order++),
            new Topic("Statement & Conclusions",         "Aptitude", "Logical Reasoning", order++),

            // Subcategory: Verbal Ability
            new Topic("Reading Comprehension",           "Aptitude", "Verbal Ability", order++),
            new Topic("Synonyms",                        "Aptitude", "Verbal Ability", order++),
            new Topic("Antonyms",                        "Aptitude", "Verbal Ability", order++),
            new Topic("Sentence Correction",             "Aptitude", "Verbal Ability", order++),
            new Topic("Fill in the Blanks",              "Aptitude", "Verbal Ability", order++),
            new Topic("Para Jumbles",                    "Aptitude", "Verbal Ability", order++),
            new Topic("Error Spotting",                  "Aptitude", "Verbal Ability", order++),
            new Topic("Active & Passive Voice",          "Aptitude", "Verbal Ability", order++),
            new Topic("Direct & Indirect Speech",        "Aptitude", "Verbal Ability", order++),

            // ═══════════════════════════════════════════════════════
            // CATEGORY: Core CS
            // ═══════════════════════════════════════════════════════

            // Subcategory: Computer Networks
            new Topic("OSI Model",                       "Core CS", "Computer Networks", order++),
            new Topic("TCP/IP Model",                    "Core CS", "Computer Networks", order++),
            new Topic("TCP vs UDP",                      "Core CS", "Computer Networks", order++),
            new Topic("IP Addressing",                   "Core CS", "Computer Networks", order++),
            new Topic("IPv4 vs IPv6",                    "Core CS", "Computer Networks", order++),
            new Topic("Subnetting",                      "Core CS", "Computer Networks", order++),
            new Topic("HTTP vs HTTPS",                   "Core CS", "Computer Networks", order++),
            new Topic("DNS",                             "Core CS", "Computer Networks", order++),
            new Topic("DHCP",                            "Core CS", "Computer Networks", order++),
            new Topic("ARP",                             "Core CS", "Computer Networks", order++),
            new Topic("ICMP",                            "Core CS", "Computer Networks", order++),
            new Topic("Congestion Control",              "Core CS", "Computer Networks", order++),
            new Topic("Flow Control",                    "Core CS", "Computer Networks", order++),
            new Topic("Error Detection",                 "Core CS", "Computer Networks", order++),
            new Topic("Network Devices",                 "Core CS", "Computer Networks", order++),
            new Topic("Firewalls",                       "Core CS", "Computer Networks", order++),
            new Topic("SSL/TLS",                         "Core CS", "Computer Networks", order++),

            // Subcategory: DBMS
            new Topic("DBMS vs RDBMS",                  "Core CS", "DBMS", order++),
            new Topic("ER Diagrams",                     "Core CS", "DBMS", order++),
            new Topic("Primary Key",                     "Core CS", "DBMS", order++),
            new Topic("Foreign Key",                     "Core CS", "DBMS", order++),
            new Topic("Candidate Key",                   "Core CS", "DBMS", order++),
            new Topic("Super Key",                       "Core CS", "DBMS", order++),
            new Topic("Normalization (1NF)",             "Core CS", "DBMS", order++),
            new Topic("Normalization (2NF)",             "Core CS", "DBMS", order++),
            new Topic("Normalization (3NF)",             "Core CS", "DBMS", order++),
            new Topic("BCNF",                            "Core CS", "DBMS", order++),
            new Topic("SQL Basics",                      "Core CS", "DBMS", order++),
            new Topic("Joins",                           "Core CS", "DBMS", order++),
            new Topic("Subqueries",                      "Core CS", "DBMS", order++),
            new Topic("Indexing",                        "Core CS", "DBMS", order++),
            new Topic("Transactions",                    "Core CS", "DBMS", order++),
            new Topic("ACID Properties",                 "Core CS", "DBMS", order++),
            new Topic("Views",                           "Core CS", "DBMS", order++),
            new Topic("Stored Procedures",               "Core CS", "DBMS", order++),
            new Topic("Triggers",                        "Core CS", "DBMS", order++),
            new Topic("Deadlocks (DBMS)",                "Core CS", "DBMS", order++),

            // Subcategory: OOPs
            new Topic("Class & Object",                  "Core CS", "OOPs", order++),
            new Topic("Encapsulation",                   "Core CS", "OOPs", order++),
            new Topic("Abstraction",                     "Core CS", "OOPs", order++),
            new Topic("Inheritance",                     "Core CS", "OOPs", order++),
            new Topic("Polymorphism",                    "Core CS", "OOPs", order++),
            new Topic("Method Overloading",              "Core CS", "OOPs", order++),
            new Topic("Method Overriding",               "Core CS", "OOPs", order++),
            new Topic("Constructors",                    "Core CS", "OOPs", order++),
            new Topic("Destructors",                     "Core CS", "OOPs", order++),
            new Topic("Interfaces",                      "Core CS", "OOPs", order++),
            new Topic("Abstract Classes",                "Core CS", "OOPs", order++),
            new Topic("Static Keyword",                  "Core CS", "OOPs", order++),
            new Topic("Final Keyword",                   "Core CS", "OOPs", order++),
            new Topic("SOLID Principles",                "Core CS", "OOPs", order++),
            new Topic("Design Patterns (Basics)",        "Core CS", "OOPs", order++),

            // Subcategory: Operating Systems
            new Topic("Process",                         "Core CS", "Operating Systems", order++),
            new Topic("Thread",                          "Core CS", "Operating Systems", order++),
            new Topic("Process vs Thread",               "Core CS", "Operating Systems", order++),
            new Topic("CPU Scheduling",                  "Core CS", "Operating Systems", order++),
            new Topic("Scheduling Algorithms",           "Core CS", "Operating Systems", order++),
            new Topic("Deadlock Conditions",             "Core CS", "Operating Systems", order++),
            new Topic("Deadlock Prevention",             "Core CS", "Operating Systems", order++),
            new Topic("Deadlock Avoidance",              "Core CS", "Operating Systems", order++),
            new Topic("Memory Management",               "Core CS", "Operating Systems", order++),
            new Topic("Paging",                          "Core CS", "Operating Systems", order++),
            new Topic("Segmentation",                    "Core CS", "Operating Systems", order++),
            new Topic("Virtual Memory",                  "Core CS", "Operating Systems", order++),
            new Topic("Thrashing",                       "Core CS", "Operating Systems", order++),
            new Topic("Synchronization",                 "Core CS", "Operating Systems", order++),
            new Topic("Semaphore",                       "Core CS", "Operating Systems", order++),
            new Topic("Mutex",                           "Core CS", "Operating Systems", order++),
            new Topic("File System",                     "Core CS", "Operating Systems", order++),
            new Topic("System Calls",                    "Core CS", "Operating Systems", order++),
            new Topic("Context Switching",               "Core CS", "Operating Systems", order++),

            // ═══════════════════════════════════════════════════════
            // CATEGORY: Coding & DSA
            // ═══════════════════════════════════════════════════════

            // Subcategory: Programming Basics
            new Topic("Variables & Data Types",          "Coding & DSA", "Programming Basics", order++),
            new Topic("Input / Output",                  "Coding & DSA", "Programming Basics", order++),
            new Topic("If–Else",                         "Coding & DSA", "Programming Basics", order++),
            new Topic("Loops",                           "Coding & DSA", "Programming Basics", order++),
            new Topic("Functions",                       "Coding & DSA", "Programming Basics", order++),
            new Topic("Arrays (Basics)",                 "Coding & DSA", "Programming Basics", order++),
            new Topic("Strings (Basics)",                "Coding & DSA", "Programming Basics", order++),
            new Topic("Pointers",                        "Coding & DSA", "Programming Basics", order++),
            new Topic("Recursion",                       "Coding & DSA", "Programming Basics", order++),

            // Subcategory: Data Structures
            new Topic("Arrays (DS)",                     "Coding & DSA", "Data Structures", order++),
            new Topic("Strings (DS)",                    "Coding & DSA", "Data Structures", order++),
            new Topic("Linked List",                     "Coding & DSA", "Data Structures", order++),
            new Topic("Stack",                           "Coding & DSA", "Data Structures", order++),
            new Topic("Queue",                           "Coding & DSA", "Data Structures", order++),
            new Topic("Hashing",                         "Coding & DSA", "Data Structures", order++),
            new Topic("Trees",                           "Coding & DSA", "Data Structures", order++),
            new Topic("Binary Search Tree",              "Coding & DSA", "Data Structures", order++),
            new Topic("Heaps",                           "Coding & DSA", "Data Structures", order++),
            new Topic("Graphs",                          "Coding & DSA", "Data Structures", order++),

            // Subcategory: Algorithms
            new Topic("Linear Search",                   "Coding & DSA", "Algorithms", order++),
            new Topic("Binary Search",                   "Coding & DSA", "Algorithms", order++),
            new Topic("Bubble Sort",                     "Coding & DSA", "Algorithms", order++),
            new Topic("Selection Sort",                  "Coding & DSA", "Algorithms", order++),
            new Topic("Insertion Sort",                  "Coding & DSA", "Algorithms", order++),
            new Topic("Merge Sort",                      "Coding & DSA", "Algorithms", order++),
            new Topic("Quick Sort",                      "Coding & DSA", "Algorithms", order++),
            new Topic("Two Pointer Technique",           "Coding & DSA", "Algorithms", order++),
            new Topic("Sliding Window",                  "Coding & DSA", "Algorithms", order++),
            new Topic("Greedy Algorithm",                "Coding & DSA", "Algorithms", order++),
            new Topic("Backtracking",                    "Coding & DSA", "Algorithms", order++),

            // Subcategory: 30 Must-Do Coding Questions
            new Topic("Prime Number",                    "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Palindrome",                      "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Fibonacci Series",                "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Factorial",                       "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Reverse a Number",                "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Armstrong Number",                "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("GCD",                             "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("LCM",                             "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Swap Two Numbers",                "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Count Digits",                    "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Sum of Digits",                   "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Anagram",                         "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Reverse String",                  "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Remove Duplicates",               "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Max Element in Array",            "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Min Element in Array",            "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Second Largest",                  "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Linear Search (Question)",        "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Binary Search (Question)",        "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Missing Number",                  "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Majority Element",                "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Frequency Count",                 "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Subarray Sum",                    "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Kadane's Algorithm",              "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Valid Parentheses",               "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Reverse Linked List",             "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Stack using Array",               "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Queue using Stack",               "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Tree Traversal",                  "Coding & DSA", "30 Must-Do Questions", order++),
            new Topic("Basic Graph Traversal",           "Coding & DSA", "30 Must-Do Questions", order++),

            // ═══════════════════════════════════════════════════════
            // CATEGORY: HR Interview
            // ═══════════════════════════════════════════════════════
            new Topic("Tell me about yourself",          "HR Interview", "HR Questions", order++),
            new Topic("Strengths",                       "HR Interview", "HR Questions", order++),
            new Topic("Weaknesses",                      "HR Interview", "HR Questions", order++),
            new Topic("Why should we hire you?",         "HR Interview", "HR Questions", order++),
            new Topic("Why this company?",               "HR Interview", "HR Questions", order++),
            new Topic("Short-term goals",                "HR Interview", "HR Questions", order++),
            new Topic("Long-term goals",                 "HR Interview", "HR Questions", order++),
            new Topic("Biggest achievement",             "HR Interview", "HR Questions", order++),
            new Topic("Biggest failure",                 "HR Interview", "HR Questions", order++),
            new Topic("Teamwork experience",             "HR Interview", "HR Questions", order++),
            new Topic("Leadership experience",           "HR Interview", "HR Questions", order++),
            new Topic("Conflict handling",               "HR Interview", "HR Questions", order++),
            new Topic("Stress handling",                 "HR Interview", "HR Questions", order++),
            new Topic("Relocation",                      "HR Interview", "HR Questions", order++),
            new Topic("Salary expectations",             "HR Interview", "HR Questions", order++),
            new Topic("Gap explanation",                 "HR Interview", "HR Questions", order++),
            new Topic("Internship discussion",           "HR Interview", "HR Questions", order++),
            new Topic("Project explanation",             "HR Interview", "HR Questions", order++)
        );
    }
}
