package com.hotelflow.dto.booking;

import com.hotelflow.model.BookingStatus;
import com.hotelflow.model.GuestTier;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record BookingCreateDto(
        @NotNull
        Long guestId,
        @NotNull
        Long roomId,
        @NotNull
        LocalDate checkInDate,
        LocalDate checkOutDate
) {
}
