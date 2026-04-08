package com.hotelflow.mappers;

import com.hotelflow.dto.review.ReviewResponseDto;
import com.hotelflow.model.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewResponseDto toReviewResponseDto(Review review) {
        return new ReviewResponseDto(
                review.getId(),
                review.getBooking().getId(),
                review.getStars(),
                review.getComment(),
                review.getSpecialRequests()
        );
    }

}
