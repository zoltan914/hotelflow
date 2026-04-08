package com.hotelflow.repository;

import com.hotelflow.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {
    boolean existsByPassportNumber(String passportNumber);
}
