package com.hotelflow.services;

import com.hotelflow.dto.room.RoomCreateDto;
import com.hotelflow.dto.room.RoomUpdateDto;
import com.hotelflow.model.Room;

import java.util.List;

public interface RoomService {
    List<Room> getAllRooms();
    Room getRoomById(Long id);
    Room createRoom(RoomCreateDto request);
    Room updateRoom(Long id, RoomUpdateDto request);
    void deleteRoom(Long id);
}
