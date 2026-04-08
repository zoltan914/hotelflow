package com.hotelflow.dto.booking;

import com.hotelflow.model.BookingStatus;
import com.hotelflow.model.GuestTier;

import java.time.LocalDate;

public record BookingResponseDto(
        Long id,
        Long guestId,
        Long roomId,
        Long wingId,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        BookingStatus status
) {
}
