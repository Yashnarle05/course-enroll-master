
package com.lms.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EnrollmentRequest {
    @NotBlank
    private String courseId;
}
