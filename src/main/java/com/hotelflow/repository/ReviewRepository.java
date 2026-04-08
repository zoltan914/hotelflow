package com.hotelflow.repository;

import com.hotelflow.model.Review;
import com.hotelflow.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByBookingId(long bookingId);
}
