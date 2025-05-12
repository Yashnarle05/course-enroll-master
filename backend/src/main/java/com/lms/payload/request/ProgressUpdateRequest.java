
package com.lms.payload.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProgressUpdateRequest {
    @NotBlank
    private String courseId;
    
    @Min(0)
    @Max(100)
    private int progress;
}
