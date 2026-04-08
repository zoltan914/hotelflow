package com.hotelflow.dto.services;

import com.hotelflow.model.ServiceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ServiceRequestCreateDto(
        @NotNull
        Long guestId,
        @NotNull
        Long staffId,
        @NotNull
        LocalDate requestDate,
        @NotNull
        ServiceType type,
        String description
) {
}
