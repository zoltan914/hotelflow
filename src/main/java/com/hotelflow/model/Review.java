package com.hotelflow.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "reviews")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = {"id"})
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "booking_id", unique = true)
    private Booking booking;

    private int stars;              // 1–5
    private String comment;         // szöveges visszajelzés
    private String specialRequests; // különleges kérések megjegyzése

}
