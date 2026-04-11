package com.hotelflow.repository;

import com.hotelflow.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    boolean existsByWingIdAndRoomNumber(Long wingId, String roomNumber);
}
