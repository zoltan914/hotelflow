package com.hotelflow.dto.guest;

import com.hotelflow.model.BookingStatus;
import com.hotelflow.model.GuestTier;

import java.time.LocalDate;

public record GuestResponseDto(
        Long id,
        String name,
        String passportNumber,
        String email,
        GuestTier tier,
        ActiveBooking activeBooking,
        long bookingCount
) {

    public record ActiveBooking(
            Long id,
            String roomNumber,
            LocalDate checkInDate,
            LocalDate checkOutDate
    ) {

    }
}
