package com.hotelflow.dto.booking;

import com.hotelflow.dto.review.ReviewResponseDto;
import com.hotelflow.model.BookingStatus;

import java.time.LocalDate;

public record BookingResponseDto(
        Long id,
        Long guestId,
        Long roomId,
        Long wingId,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        BookingStatus status,
        ReviewResponseDto review
) {
}