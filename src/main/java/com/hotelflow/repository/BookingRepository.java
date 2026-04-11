package com.hotelflow.repository;

import com.hotelflow.model.Booking;
import com.hotelflow.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
        SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
        from Booking b
        where b.status in (:bookingStatuses)
        AND b.room.id = :roomId
        AND (
            (b.checkOutDate IS NULL)
            OR
            (:checkOutDateRequest IS NULL)
            OR (
                :checkInDateRequest <= b.checkOutDate
                AND :checkOutDateRequest >= b.checkInDate
            )
        )
    """)
    boolean hasOverlappingBookingByDateAndStatus(
            @Param("checkInDateRequest") LocalDate checkInDateRequest,
            @Param("checkOutDateRequest") LocalDate checkOutDateRequest,
            @Param("bookingStatuses") List<BookingStatus> bookingStatuses,
            @Param("roomId") Long roomId
    );

}
/*
     a| ------------- |b

c| ---------|d

c < b and d > a
               a| ------------- |b

c| ---------|d

c < b and d < a

                a| ------------- |b

                                    c| ---------|d

*/