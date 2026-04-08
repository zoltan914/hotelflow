package com.hotelflow.services.impl;

import com.hotelflow.dto.room.RoomCreateDto;
import com.hotelflow.dto.room.RoomUpdateDto;
import com.hotelflow.model.Booking;
import com.hotelflow.model.Room;
import com.hotelflow.model.Wing;
import com.hotelflow.repository.RoomRepository;
import com.hotelflow.services.RoomService;
import com.hotelflow.services.WingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.hotelflow.model.BookingStatus.ACTIVE;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final WingService wingService;

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("A szoba nem található: " + id));
    }

    @Override
    public Room createRoom(RoomCreateDto request) {
        Wing wing = wingService.getWingById(request.wingId());
        Room room = Room.builder()
                .roomNumber(request.roomNumber())
                .wing(wing)
                .type(request.roomType())
                .pricePerNight(request.pricePerNight())
                .capacity(request.capacity())
                .build();
        return roomRepository.save(room);
    }

    @Override
    public Room updateRoom(Long id, RoomUpdateDto request) {
        Room room = getRoomById(id);
        room.setRoomNumber(request.roomNumber() != null ?  request.roomNumber() : room.getRoomNumber());
        room.setType(request.roomType() != null ? request.roomType() : room.getType());
        room.setPricePerNight(request.pricePerNight() != null ?  request.pricePerNight() : room.getPricePerNight());
        room.setCapacity(request.capacity() != room.getCapacity() ? request.capacity() : room.getCapacity());
        if (request.wingId() != null) {
            Wing wing = wingService.getWingById(request.wingId());
            room.setWing(wing);
        }
        return roomRepository.save(room);
    }

    @Override
    @Transactional
    public void deleteRoom(Long id) {
        Room room = getRoomById(id);
        List<Booking> bookings = room.getBookings();
        boolean hasActiveBooking = bookings.stream()
                .anyMatch(booking -> booking.getStatus().equals(ACTIVE));
        if (hasActiveBooking) {
            throw new IllegalStateException("A szoba nem törölhető mert van aktív foglalása");
        }
        roomRepository.delete(room);
    }
}
