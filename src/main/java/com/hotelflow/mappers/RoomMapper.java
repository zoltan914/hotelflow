package com.hotelflow.mappers;

import com.hotelflow.dto.room.RoomResponseDto;
import com.hotelflow.model.Booking;
import com.hotelflow.model.BookingStatus;
import com.hotelflow.model.Room;
import com.hotelflow.model.Wing;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import static com.hotelflow.model.BookingStatus.ACTIVE;
import static com.hotelflow.model.BookingStatus.PENDING;

@Component
public class RoomMapper {

    public List<RoomResponseDto> toRoomResponseDtoList(List<Room> rooms) {
        return rooms.stream()
                .map(this::toRoomResponseDto).toList();
    }

    public RoomResponseDto toRoomResponseDto(Room room) {
        List<Booking> bookings = room.getBookings();
        Wing wing = room.getWing();
        Long bookedNightsCount = bookings.stream()
                .filter(booking ->
                        booking.getStatus().equals(PENDING) ||
                        booking.getStatus().equals(ACTIVE))
                .reduce(0L, (subtotal, booking) -> {
                    long days;
                    if (booking.getCheckOutDate() == null) {
                        days = Period.between(booking.getCheckInDate(), LocalDate.now()).getDays();
                    } else {
                        days = Period.between(booking.getCheckInDate(), booking.getCheckOutDate()).getDays();
                    }
                    return subtotal + days;
                }, Long::sum);
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
