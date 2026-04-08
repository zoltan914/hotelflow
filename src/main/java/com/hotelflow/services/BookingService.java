package com.hotelflow.services;

import com.hotelflow.dto.booking.BookingCreateDto;
import com.hotelflow.model.Booking;

import java.util.List;

public interface BookingService {
    List<Booking> getAllBookings();
    Booking getBookingById(Long id);
    Booking createBooking(BookingCreateDto request);
    Booking checkInBooking(Long id);
    Booking checkOutBooking(Long id);
    Booking cancelBooking(Long id);
}
