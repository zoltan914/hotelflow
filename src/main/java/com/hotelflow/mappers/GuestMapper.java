package com.hotelflow.mappers;

import com.hotelflow.dto.guest.GuestResponseDto;
import com.hotelflow.model.Booking;
import com.hotelflow.model.Guest;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.hotelflow.model.BookingStatus.ACTIVE;

@Component
public class GuestMapper {

    public List<GuestResponseDto> toGuestResponseDtoList(List<Guest> guests) {
        return guests.stream()
                .map(this::toGuestResponseDto).toList();
    }

    public GuestResponseDto toGuestResponseDto(Guest guest) {
        List<Booking> bookings = guest.getBookings();
        Booking activeBooking = bookings.stream()
                .filter(booking -> booking.getStatus().equals(ACTIVE))
                .findAny().orElse(null);
        return new GuestResponseDto(
                guest.getId(),
                guest.getName(),
                guest.getPassportNumber(),
                guest.getEmail(),
                guest.getTier(),
                activeBooking != null ? new GuestResponseDto.ActiveBooking(
                        activeBooking.getId(),
                        activeBooking.getRoom().getRoomNumber(),
                        activeBooking.getCheckInDate(),
                        activeBooking.getCheckOutDate()
                ) : null,
                bookings.size()
        );
    }

}
