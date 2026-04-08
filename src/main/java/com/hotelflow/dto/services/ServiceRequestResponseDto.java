package com.hotelflow.dto.services;

import com.hotelflow.model.ServiceType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ServiceRequestResponseDto(
        Long id,
        Long guestId,
        Long staffId,
        LocalDate requestDate,
        ServiceType type,
        String description
) {
}
