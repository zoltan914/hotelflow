package com.hotelflow.dto.staff;

import com.hotelflow.model.StaffRole;

public record StaffUpdateDto(
        String name,
        StaffRole role,
        String email,
        Long wingId
) {
}
