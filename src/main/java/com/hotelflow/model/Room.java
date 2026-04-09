package com.hotelflow.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "rooms")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = {"id"})
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;

    @ManyToOne
    private Wing wing;

    @Enumerated(EnumType.STRING)
    private RoomType type;

    private BigDecimal pricePerNight;

    private int capacity;

    @Builder.Default
    @OneToMany(mappedBy = "room", orphanRemoval = true, fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    private List<Booking> bookings = new ArrayList<>();

}
