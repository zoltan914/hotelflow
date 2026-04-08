package com.hotelflow.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Data
@Entity
@Table(name = "staff")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = {"id"})
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private StaffRole role;

    private String email;

    @ManyToOne
    private Wing wing;

    @Builder.Default
    @OneToMany(mappedBy = "assignedStaff", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ServiceRequest> serviceRequests = new ArrayList<>();

}
