
package com.lms.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "courses")
public class Course {
    
    @Id
    private String id;
    
    private String title;
    
    private String description;
    
    private String instructor;
    
    private String thumbnail;
    
    private String duration;
    
    private String level; // "Beginner", "Intermediate", "Advanced"
    
    private double price;
    
    private String createdAt;
    
    private String updatedAt;
}
