package com.hotelflow.dto.wing;

public record WingUpdateDto(
        String name,           // pl. "Medence-szárny"
        String description,
        String managerName    // szárnyvezető
) {
}
