
package com.lms.controller;

import com.lms.model.Course;
import com.lms.payload.response.MessageResponse;
import com.lms.repository.CourseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String level) {
        
        List<Course> courses;
        
        if (title != null && !title.isEmpty()) {
            courses = courseRepository.findByTitleContainingIgnoreCase(title);
        } else if (level != null && !level.isEmpty()) {
            courses = courseRepository.findByLevel(level);
        } else {
            courses = courseRepository.findAll();
        }
        
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        Optional<Course> course = courseRepository.findById(id);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        course.setCreatedAt(Instant.now().toString());
        course.setUpdatedAt(Instant.now().toString());
        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCourse(@PathVariable String id, @RequestBody Course course) {
        return courseRepository.findById(id)
                .map(existingCourse -> {
                    existingCourse.setTitle(course.getTitle());
                    existingCourse.setDescription(course.getDescription());
                    existingCourse.setInstructor(course.getInstructor());
                    existingCourse.setThumbnail(course.getThumbnail());
                    existingCourse.setDuration(course.getDuration());
                    existingCourse.setLevel(course.getLevel());
                    existingCourse.setPrice(course.getPrice());
                    existingCourse.setUpdatedAt(Instant.now().toString());
                    return ResponseEntity.ok(courseRepository.save(existingCourse));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable String id) {
        return courseRepository.findById(id)
                .map(course -> {
                    courseRepository.delete(course);
                    return ResponseEntity.ok(new MessageResponse("Course deleted successfully"));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
