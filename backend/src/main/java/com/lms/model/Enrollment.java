
package com.lms.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;

@Data
@Document(collection = "enrollments")
@CompoundIndex(name = "user_course_idx", def = "{'userId': 1, 'courseId': 1}", unique = true)
public class Enrollment {
    
    @Id
    private String id;
    
    private String userId;
    
    private String courseId;
    
    private String enrolledAt;
    
    private int progress;
    
    private String updatedAt;
}
