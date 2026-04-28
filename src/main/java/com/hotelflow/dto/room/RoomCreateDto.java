package com.hotelflow.dto.room;

import com.hotelflow.model.RoomType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record RoomCreateDto(
        @NotBlank
        String roomNumber,
        @NotNull
        Long wingId,
        @NotNull
        RoomType roomType,
        @NotNull
        @Min(value = 1, message = "A szoba ára minimum 1")
        BigDecimal pricePerNight,
        @NotNull
        @Min(value = 1, message = "A szoba kapacitása minimum 1")
        int capacity
) {
}
