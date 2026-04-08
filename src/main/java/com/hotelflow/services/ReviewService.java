package com.hotelflow.services;

import com.hotelflow.dto.review.ReviewCreateDto;
import com.hotelflow.dto.review.ReviewUpdateDto;
import com.hotelflow.model.Review;

import java.util.List;

public interface ReviewService {
    List<Review> getAllReviews();
    Review getReviewById(Long id);
    Review createReview(Long bookingId, ReviewCreateDto request);
    Review updateReview(Long bookingId, ReviewUpdateDto request);
}
