package com.hotelflow.dto.room;

import com.hotelflow.model.RoomType;

import java.math.BigDecimal;

public record RoomResponseDto(
        Long id,
        String roomNumber,
        Long wingId,
        RoomType roomType,
        BigDecimal pricePerNight,
        int capacity,
        long bookedNightsCount
) {
}
