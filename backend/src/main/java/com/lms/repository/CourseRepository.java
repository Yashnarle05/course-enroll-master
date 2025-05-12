
package com.lms.repository;

import com.lms.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    
    List<Course> findByTitleContainingIgnoreCase(String title);
    
    List<Course> findByLevel(String level);
}
