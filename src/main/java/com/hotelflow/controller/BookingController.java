package com.hotelflow.controller;

import com.hotelflow.dto.booking.BookingCreateDto;
import com.hotelflow.dto.booking.BookingResponseDto;
import com.hotelflow.dto.review.ReviewCreateDto;
import com.hotelflow.dto.review.ReviewResponseDto;
import com.hotelflow.dto.review.ReviewUpdateDto;
import com.hotelflow.mappers.BookingMapper;
import com.hotelflow.mappers.ReviewMapper;
import com.hotelflow.model.Booking;
import com.hotelflow.model.Review;
import com.hotelflow.services.BookingService;
import com.hotelflow.services.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.hotelflow.model.BookingStatus.ACTIVE;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService  bookingService;
    private final ReviewService  reviewService;
    private final BookingMapper  bookingMapper;
    private final ReviewMapper reviewMapper;

    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookingMapper.toBookingResponseDtoList(bookings));
    }

    @GetMapping("/active")
    public ResponseEntity<List<BookingResponseDto>> getAllActiveBookings() {
        List<Booking> bookings = bookingService.getAllBookings().stream()
                .filter(booking -> booking.getStatus().equals(ACTIVE))
                .toList();
        return ResponseEntity.ok(bookingMapper.toBookingResponseDtoList(bookings));
    }

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(
            @Valid @RequestBody BookingCreateDto request
    ) {
        Booking booking = bookingService.createBooking(request);
        return ResponseEntity.ok(bookingMapper.toBookingResponseDto(booking));
    }

    @PutMapping("/{id}/checkin")
    public ResponseEntity<BookingResponseDto> checkInBooking(
            @PathVariable Long id
    ) {
        Booking booking = bookingService.checkInBooking(id);
        return  ResponseEntity.ok(bookingMapper.toBookingResponseDto(booking));
    }

    @PutMapping("/{id}/checkout")
    public ResponseEntity<BookingResponseDto> checkOutBooking(
            @PathVariable Long id
    ) {
        Booking booking = bookingService.checkOutBooking(id);
        return  ResponseEntity.ok(bookingMapper.toBookingResponseDto(booking));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDto> cancelBooking(
            @PathVariable Long id
    ) {
        Booking booking = bookingService.cancelBooking(id);
        return  ResponseEntity.ok(bookingMapper.toBookingResponseDto(booking));
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<ReviewResponseDto> createReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewCreateDto request
    ) {
        Review review = reviewService.createReview(id, request);
        return ResponseEntity.ok(reviewMapper.toReviewResponseDto(review));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<ReviewResponseDto> updateReview(
            @PathVariable Long id,
            @RequestBody ReviewUpdateDto request
    ) {
        Review review = reviewService.updateReview(id, request);
        return ResponseEntity.ok(reviewMapper.toReviewResponseDto(review));
    }



}
