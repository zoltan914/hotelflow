package com.hotelflow.repository;

import com.hotelflow.model.Room;
import com.hotelflow.model.Wing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
}
