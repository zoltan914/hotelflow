package com.hotelflow.dto.guest;

import com.hotelflow.model.GuestTier;
import com.hotelflow.model.StaffRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GuestCreateDto(
        @NotBlank
        String name,
        @NotBlank
        String passportNumber,
        @NotBlank
        @Email
        String email,
        @NotNull
        GuestTier tier
) {
}
