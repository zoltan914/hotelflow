package com.hotelflow.repository;

import com.hotelflow.model.Wing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WingRepository extends JpaRepository<Wing, Long> {
}
