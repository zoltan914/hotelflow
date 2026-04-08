package com.hotelflow.mappers;

import com.hotelflow.dto.booking.BookingResponseDto;
import com.hotelflow.model.Booking;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BookingMapper {

    public List<BookingResponseDto> toBookingResponseDtoList(List<Booking> bookings) {
        return bookings.stream()
                .map(this::toBookingResponseDto).toList();
    }

    public BookingResponseDto toBookingResponseDto(Booking booking) {
        return new BookingResponseDto(
                booking.getId(),
                booking.getGuest().getId(),
                booking.getRoom().getId(),
                booking.getRoom().getWing().getId(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getStatus()
        );
    }

}
