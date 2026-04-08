package com.hotelflow.dto.wing;

import jakarta.validation.constraints.NotBlank;

public record WingCreateDto(
        @NotBlank
        String name,           // pl. "Medence-szárny"
        @NotBlank
        String description,
        @NotBlank
        String managerName    // szárnyvezető
) {
}
