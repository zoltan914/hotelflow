package com.hotelflow.dto.review;

import jakarta.validation.constraints.NotNull;

public record ReviewCreateDto(
        @NotNull
        int stars,
        String comment,
        String specialRequests
) {
}
