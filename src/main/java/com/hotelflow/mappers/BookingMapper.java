package com.hotelflow.mappers;

import com.hotelflow.dto.booking.BookingResponseDto;
import com.hotelflow.model.Booking;
import com.hotelflow.model.Review;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final ReviewMapper reviewMapper;

    public List<BookingResponseDto> toBookingResponseDtoList(List<Booking> bookings) {
        return bookings.stream()
                .map(this::toBookingResponseDto).toList();
    }

    public BookingResponseDto toBookingResponseDto(Booking booking) {
        Review review = booking.getReview();
        return new BookingResponseDto(
                booking.getId(),
                booking.getGuest().getId(),
                booking.getRoom().getId(),
                booking.getRoom().getWing().getId(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getStatus(),
                review != null ? reviewMapper.toReviewResponseDto(review) : null
        );
    }

}
