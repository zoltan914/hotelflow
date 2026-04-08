package com.hotelflow.dto.wing;

public record WingResponseDto(
        Long id,
        String name,
        String description,
        String managerName,
        long staffCount,
        long roomCount
) {
}
