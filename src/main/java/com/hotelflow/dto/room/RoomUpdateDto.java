package com.hotelflow.dto.room;

import com.hotelflow.model.RoomType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record RoomUpdateDto(
        String roomNumber,
        Long wingId,
        RoomType roomType,
        BigDecimal pricePerNight,
        int capacity
) {
}
