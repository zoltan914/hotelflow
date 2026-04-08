package com.hotelflow.dto.guest;

import com.hotelflow.model.GuestTier;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GuestUpdateDto(
        String name,
        String passportNumber,
        String email,
        GuestTier tier
) {
}
