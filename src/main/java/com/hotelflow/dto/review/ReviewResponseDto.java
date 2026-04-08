package com.hotelflow.dto.review;

public record ReviewResponseDto(
        Long id,
        Long bookingId,
        int stars,
        String comment,
        String specialRequests
) {
}
