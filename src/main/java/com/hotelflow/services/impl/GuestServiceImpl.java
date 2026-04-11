package com.hotelflow.services.impl;

import com.hotelflow.dto.guest.GuestCreateDto;
import com.hotelflow.dto.guest.GuestUpdateDto;
import com.hotelflow.exception.DuplicationException;
import com.hotelflow.model.Booking;
import com.hotelflow.model.BookingStatus;
import com.hotelflow.model.Guest;
import com.hotelflow.repository.GuestRepository;
import com.hotelflow.services.GuestService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class GuestServiceImpl implements GuestService {

    private  final GuestRepository guestRepository;

    @Override
    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    @Override
    public Guest getGuestById(Long id) {
        return guestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("A vendég nem található: " + id));
    }

    @Override
    public Guest createGuest(GuestCreateDto request) {
        if (guestRepository.existsByPassportNumber(request.passportNumber())) {
            throw new DuplicationException("Ez az útlevélszám már regisztrálva van: " + request.passportNumber());
        }
        Guest guest = Guest.builder()
                .name(request.name())
                .passportNumber(request.passportNumber())
                .email(request.email())
                .tier(request.tier())
                .build();
        return  guestRepository.save(guest);
    }

    @Override
    public Guest updateGuest(Long id, GuestUpdateDto request) {
        Guest  guest = getGuestById(id);
        guest.setName(request.name() != null ? request.name() : guest.getName());
        guest.setPassportNumber(request.passportNumber() != null ? request.passportNumber() : guest.getPassportNumber());
        guest.setEmail(request.email() != null ? request.email() : guest.getEmail());
        guest.setTier(request.tier() != null ? request.tier() : guest.getTier());
        return guestRepository.save(guest);
    }

    @Override
    @Transactional
    public void deleteGuest(Long id) {
        Guest guest = getGuestById(id);
        List<Booking> bookings = guest.getBookings();
        boolean hasActiveBooking = bookings.stream()
                .anyMatch(booking -> booking.getStatus().equals(BookingStatus.ACTIVE));
        if (hasActiveBooking) {
            throw new IllegalStateException("A vendég nem törölhető mert van aktív foglalása");
        }

        guestRepository.delete(guest);
    }
}
