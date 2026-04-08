package com.hotelflow.services;

import com.hotelflow.dto.guest.GuestCreateDto;
import com.hotelflow.dto.guest.GuestUpdateDto;
import com.hotelflow.model.Guest;

import java.util.List;

public interface GuestService {
    List<Guest> getAllGuests();
    Guest getGuestById(Long id);
    Guest createGuest(GuestCreateDto request);
    Guest updateGuest(Long id, GuestUpdateDto request);
    void deleteGuest(Long id);
}
