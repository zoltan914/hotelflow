package com.hotelflow.dto.room;

import com.hotelflow.model.GuestTier;
import com.hotelflow.model.RoomType;
import jakarta.validation.constraints.Email;
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
        @Min(1)
        BigDecimal pricePerNight,
        @NotNull
        @Min(1)
        int capacity
) {
}
