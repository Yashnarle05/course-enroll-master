
package com.lms.controller;

import com.lms.model.Course;
import com.lms.model.Enrollment;
import com.lms.model.User;
import com.lms.payload.request.EnrollmentRequest;
import com.lms.payload.request.ProgressUpdateRequest;
import com.lms.payload.response.MessageResponse;
import com.lms.repository.CourseRepository;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<Course>> getEnrolledCourses() {
        String email = getCurrentUserEmail();
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        
        User user = userOptional.get();
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(user.getId());
        List<Course> enrolledCourses = new ArrayList<>();
        
        for (Enrollment enrollment : enrollments) {
            courseRepository.findById(enrollment.getCourseId())
                    .ifPresent(enrolledCourses::add);
        }
        
        return ResponseEntity.ok(enrolledCourses);
    }

    @PostMapping("/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> enrollCourse(@RequestBody EnrollmentRequest enrollmentRequest) {
        String email = getCurrentUserEmail();
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User not found"));
        }
        
        User user = userOptional.get();
        String courseId = enrollmentRequest.getCourseId();
        
        // Check if course exists
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Course not found"));
        }
        
        // Check if already enrolled
        if (enrollmentRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Already enrolled in this course"));
        }
        
        // Create enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setUserId(user.getId());
        enrollment.setCourseId(courseId);
        enrollment.setEnrolledAt(Instant.now().toString());
        enrollment.setProgress(0);
        enrollment.setUpdatedAt(Instant.now().toString());
        
        enrollmentRepository.save(enrollment);
        
        // Update user's enrolled courses
        user.getEnrolledCourses().add(courseId);
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse("Successfully enrolled in course"));
    }

    @PutMapping("/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> updateProgress(@RequestBody ProgressUpdateRequest progressUpdateRequest) {
        String email = getCurrentUserEmail();
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User not found"));
        }
        
        User user = userOptional.get();
        String courseId = progressUpdateRequest.getCourseId();
        int progress = progressUpdateRequest.getProgress();
        
        // Validate progress value
        if (progress < 0 || progress > 100) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Progress must be between 0 and 100"));
        }
        
        // Find enrollment
        Optional<Enrollment> enrollmentOptional = enrollmentRepository.findByUserIdAndCourseId(
                user.getId(), courseId);
        
        if (enrollmentOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Not enrolled in this course"));
        }
        
        Enrollment enrollment = enrollmentOptional.get();
        enrollment.setProgress(progress);
        enrollment.setUpdatedAt(Instant.now().toString());
        
        enrollmentRepository.save(enrollment);
        
        return ResponseEntity.ok(new MessageResponse("Progress updated successfully"));
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return null;
    }
}
