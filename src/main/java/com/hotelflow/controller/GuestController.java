package com.hotelflow.controller;

import com.hotelflow.dto.guest.GuestCreateDto;
import com.hotelflow.dto.guest.GuestResponseDto;
import com.hotelflow.dto.guest.GuestUpdateDto;
import com.hotelflow.mappers.GuestMapper;
import com.hotelflow.model.Guest;
import com.hotelflow.services.GuestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
@RequiredArgsConstructor
public class GuestController {

    private final GuestService guestService;
    private final GuestMapper guestMapper;

    @GetMapping
    public ResponseEntity<List<GuestResponseDto>> getAllGuests() {
        List<Guest> guests = guestService.getAllGuests();
        return ResponseEntity.ok(guestMapper.toGuestResponseDtoList(guests));
    }

    @PostMapping
    public ResponseEntity<GuestResponseDto> createGuest(
            @RequestBody GuestCreateDto request
    ) {
        Guest guest =  guestService.createGuest(request);
        return ResponseEntity.ok(guestMapper.toGuestResponseDto(guest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuestResponseDto> updateGuest(
            @PathVariable Long id,
            @RequestBody GuestUpdateDto request
    ) {
        Guest guest = guestService.updateGuest(id, request);
        return ResponseEntity.ok(guestMapper.toGuestResponseDto(guest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuest(
            @PathVariable Long id
    ) {
        guestService.deleteGuest(id);
        return ResponseEntity.noContent().build();
    }

}
