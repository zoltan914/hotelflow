package com.hotelflow.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "wings")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = {"id"})
public class Wing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;           // pl. "Medence-szárny"
    private String description;
    private String managerName;    // szárnyvezető

    @Builder.Default
    @OneToMany(mappedBy = "wing", orphanRemoval = true, fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    private List<Staff> staff = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "wing", orphanRemoval = true, fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    private List<Room> rooms = new ArrayList<>();

}
