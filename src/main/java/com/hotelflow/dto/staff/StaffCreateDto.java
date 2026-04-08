package com.hotelflow.dto.staff;

import com.hotelflow.model.StaffRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record StaffCreateDto(
        @NotBlank
        String name,
        @NotNull
        StaffRole role,
        @NotBlank
        @Email
        String email,
        @NotNull
        Long wingId
) {
}
