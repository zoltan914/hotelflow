package com.hotelflow.services.impl;

import com.hotelflow.dto.booking.BookingCreateDto;
import com.hotelflow.model.Booking;
import com.hotelflow.model.Guest;
import com.hotelflow.model.Room;
import com.hotelflow.repository.BookingRepository;
import com.hotelflow.services.BookingService;
import com.hotelflow.services.GuestService;
import com.hotelflow.services.RoomService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static com.hotelflow.model.BookingStatus.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final GuestService guestService;
    private final RoomService roomService;

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("A foglalás nem található: " + id));
    }

    @Override
    @Transactional
    public Booking createBooking(BookingCreateDto request) {
        Room room = roomService.getRoomById(request.roomId());
        Guest guest = guestService.getGuestById(request.guestId());

        LocalDate now = LocalDate.now();
        if (request.checkInDate().isBefore(now)) {
            throw new IllegalStateException("Foglalás kezdetének dátuma csak jövőben lehetséges");
        }
        // BUG JAVÍTÁS: az eredeti feltétel fordítva volt (isBefore helyett isAfter kell)
        if (request.checkOutDate() != null && !request.checkOutDate().isAfter(request.checkInDate())) {
            throw new IllegalStateException("A kijelentkezés dátuma a bejelentkezés után kell legyen");
        }

        // 3. szabály: ACTIVE vagy PENDING átfedő foglalás ellenőrzése
        boolean hasOverlappingBooking = bookingRepository
                .hasOverlappingBookingByDateAndStatus(
                        request.checkInDate(),
                        request.checkOutDate(),
                        List.of(ACTIVE, PENDING),
                        room.getId()
                );
        if (hasOverlappingBooking) {
            throw new IllegalStateException("A szoba a megadott időszakra már foglalt");
        }

        // 4. szabály: vendégnek nincs-e már ACTIVE foglalása
        boolean guestHasActiveBooking = guest.getBookings().stream()
                .anyMatch(b -> b.getStatus().equals(ACTIVE));
        if (guestHasActiveBooking) {
            throw new IllegalStateException("A vendégnek már van aktív foglalása");
        }

        Booking booking = Booking.builder()
                .guest(guest)
                .room(room)
                .checkInDate(request.checkInDate())
                .checkOutDate(request.checkOutDate())
                .status(PENDING)
                .build();
        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public Booking checkInBooking(Long id) {
        Booking booking = getBookingById(id);
        if (!booking.getStatus().equals(PENDING)) {
            throw new IllegalStateException("A státusz nem módosítható");
        }
        booking.setStatus(ACTIVE);
        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public Booking checkOutBooking(Long id) {
        Booking booking = getBookingById(id);
        if (!booking.getStatus().equals(ACTIVE)) {
            throw new IllegalStateException("A státusz nem módosítható");
        }
        booking.setStatus(CHECKED_OUT);
        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        if (!booking.getStatus().equals(PENDING)) {
            throw new IllegalStateException("A státusz nem módosítható");
        }
        booking.setStatus(CANCELLED);
        return bookingRepository.save(booking);
    }
}
