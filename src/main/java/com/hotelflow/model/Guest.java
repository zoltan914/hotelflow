package com.hotelflow.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "guests")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = {"id"})
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String passportNumber;

    private String email;

    @Enumerated(EnumType.STRING)
    private GuestTier tier;

    @Builder.Default
    @OneToMany(mappedBy = "guest", orphanRemoval = true, fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    private List<Booking> bookings = new ArrayList<>();
}
