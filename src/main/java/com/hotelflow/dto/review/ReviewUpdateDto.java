package com.hotelflow.dto.review;

import jakarta.validation.constraints.NotNull;

public record ReviewUpdateDto(
        int stars,
        String comment,
        String specialRequests
) {
}
