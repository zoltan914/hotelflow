package com.hotelflow.controller;

import com.hotelflow.dto.room.RoomCreateDto;
import com.hotelflow.dto.room.RoomResponseDto;
import com.hotelflow.dto.room.RoomUpdateDto;
import com.hotelflow.mappers.RoomMapper;
import com.hotelflow.model.Room;
import com.hotelflow.services.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final RoomMapper roomMapper;

    @GetMapping
    public ResponseEntity<List<RoomResponseDto>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(roomMapper.toRoomResponseDtoList(rooms));
    }

    @PostMapping
    public ResponseEntity<RoomResponseDto> createRoom(
            @Valid @RequestBody RoomCreateDto request
    ) {
        Room room = roomService.createRoom(request);
        return ResponseEntity.ok(roomMapper.toRoomResponseDto(room));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomResponseDto> updateRoom(
            @PathVariable Long id,
            @RequestBody RoomUpdateDto request
    ) {
        Room room = roomService.updateRoom(id, request);
        return ResponseEntity.ok(roomMapper.toRoomResponseDto(room));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(
            @PathVariable Long id
    ) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
