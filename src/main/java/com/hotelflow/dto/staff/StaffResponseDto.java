package com.hotelflow.dto.staff;

import com.hotelflow.model.StaffRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record StaffResponseDto(
        Long id,
        String name,
        StaffRole role,
        String email,
        Long wingId
) {
}
