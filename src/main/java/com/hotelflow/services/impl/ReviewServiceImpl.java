package com.hotelflow.services.impl;

import com.hotelflow.dto.review.ReviewCreateDto;
import com.hotelflow.dto.review.ReviewUpdateDto;
import com.hotelflow.exception.DuplicationException;
import com.hotelflow.model.Booking;
import com.hotelflow.model.Review;
import com.hotelflow.repository.ReviewRepository;
import com.hotelflow.services.BookingService;
import com.hotelflow.services.ReviewService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.hotelflow.model.BookingStatus.CHECKED_OUT;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingService bookingService;

    @Override
    public List<Review> getAllReviews() {
        return  reviewRepository.findAll();
    }

    @Override
    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Az értékelés nem található: " + id));
    }

    @Override
    @Transactional
    public Review createReview(Long bookingId, ReviewCreateDto request) {
        Booking booking = bookingService.getBookingById(bookingId);
        boolean hasReview = reviewRepository.findByBookingId(bookingId)
                .isPresent();
        if (hasReview) {
            throw new DuplicationException("A foglaláshoz már van értékelés rögzítve");
        }
        if (!booking.getStatus().equals(CHECKED_OUT)) {
            throw new IllegalStateException("Értékelés csak CHECKED_OUT státuszú foglaláshoz adható");
        }
        Review review = Review.builder()
                .booking(booking)
                .stars(request.stars())
                .comment(request.comment())
                .specialRequests(request.specialRequests())
                .build();
        return reviewRepository.save(review);
    }

    @Override
    public Review updateReview(Long bookingId, ReviewUpdateDto request) {
        Review review = reviewRepository.findByBookingId(bookingId)
                        .orElseThrow(() -> new EntityNotFoundException("Az értékelés nem található a foglaláshoz: " + bookingId));
        review.setStars(request.stars() != 0 ? request.stars() : review.getStars());
        review.setComment(request.comment() != null ?  request.comment() : review.getComment());
        review.setSpecialRequests(request.specialRequests() != null ?   request.specialRequests() : review.getSpecialRequests());
        return reviewRepository.save(review);
    }
}
