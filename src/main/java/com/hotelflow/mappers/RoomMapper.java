package com.hotelflow.mappers;

import com.hotelflow.dto.room.RoomResponseDto;
import com.hotelflow.model.Booking;
import com.hotelflow.model.Room;
import com.hotelflow.model.Wing;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.hotelflow.model.BookingStatus.ACTIVE;

@Component
public class RoomMapper {

    public List<RoomResponseDto> toRoomResponseDtoList(List<Room> rooms) {
        return rooms.stream()
                .map(this::toRoomResponseDto).toList();
    }

    public RoomResponseDto toRoomResponseDto(Room room) {
        List<Booking> bookings = room.getBookings();
        Wing wing = room.getWing();
        long bookedNightsCount = bookings.stream()
                .filter(booking -> booking.getStatus().equals(ACTIVE))
                .count();
        return new RoomResponseDto(
                room.getId(),
                room.getRoomNumber(),
                wing.getId(),
                room.getType(),
                room.getPricePerNight(),
                room.getCapacity(),
                bookedNightsCount
        );
    }

}
