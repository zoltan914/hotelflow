package com.hotelflow.controller;

import com.hotelflow.model.*;
import com.hotelflow.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/simulation")
@RequiredArgsConstructor
public class SimulationController {

    private final WingRepository wingRepository;
    private final StaffRepository staffRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final ReviewRepository reviewRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> simulate() {

        // ── Törlés ─────────────────────────────────────────────────────────
        reviewRepository.deleteAllInBatch();
        bookingRepository.deleteAllInBatch();
        serviceRequestRepository.deleteAllInBatch();
        roomRepository.deleteAllInBatch();
        staffRepository.deleteAllInBatch();
        guestRepository.deleteAllInBatch();
        wingRepository.deleteAllInBatch();

        // ── 1. SZÁRNYAK (3 db) ─────────────────────────────────────────────
        Wing foepulet = wingRepository.save(Wing.builder()
                .name("Főépület")
                .description("A szálloda eredeti, klasszikus szárnya a recepcióval és az étteremmel")
                .managerName("Horváth Péter")
                .build());

        Wing medenceSzarny = wingRepository.save(Wing.builder()
                .name("Medence-szárny")
                .description("Újonnan épített szárny, minden szoba medence- vagy kertkilátással")
                .managerName("Szabó Anna")
                .build());

        Wing pentHouseSzarny = wingRepository.save(Wing.builder()
                .name("Penthouse-szárny")
                .description("Exkluzív tetőszinti szárny panorámás kilátással a városra")
                .managerName("Fekete Márton")
                .build());

        // Extra szárny – törölhető (nincs hozzá semmi)
        wingRepository.save(Wing.builder()
                .name("Keleti-szárny")
                .description("Átmeneti szárny, jelenleg felújítás alatt – hamarosan megnyílik")
                .managerName("Varga Ildikó")
                .build());

        // ── 2. SZEMÉLYZET (6 db) ───────────────────────────────────────────
        Staff recepcios1 = staffRepository.save(Staff.builder()
                .name("Kis Zsuzsa")
                .role(StaffRole.RECEPTIONIST)
                .email("kis.zsuzsa@hotelflow.hu")
                .wing(foepulet)
                .build());

        Staff recepcios2 = staffRepository.save(Staff.builder()
                .name("Nagy Tibor")
                .role(StaffRole.RECEPTIONIST)
                .email("nagy.tibor@hotelflow.hu")
                .wing(foepulet)
                .build());

        Staff haziasszony1 = staffRepository.save(Staff.builder()
                .name("Molnár Éva")
                .role(StaffRole.HOUSEKEEPER)
                .email("molnar.eva@hotelflow.hu")
                .wing(medenceSzarny)
                .build());

        Staff haziasszony2 = staffRepository.save(Staff.builder()
                .name("Tóth Margit")
                .role(StaffRole.HOUSEKEEPER)
                .email("toth.margit@hotelflow.hu")
                .wing(foepulet)
                .build());

        Staff concierge1 = staffRepository.save(Staff.builder()
                .name("Balogh Gábor")
                .role(StaffRole.CONCIERGE)
                .email("balogh.gabor@hotelflow.hu")
                .wing(pentHouseSzarny)
                .build());

        Staff manager = staffRepository.save(Staff.builder()
                .name("Kovács Béla")
                .role(StaffRole.MANAGER)
                .email("kovacs.bela@hotelflow.hu")
                .wing(foepulet)
                .build());

        // Extra személyzet – törölhető (nincs hozzá service request, múltbeli dátummal)
        Staff torolehetoStaff = staffRepository.save(Staff.builder()
                .name("Papp Réka")
                .role(StaffRole.HOUSEKEEPER)
                .email("papp.reka@hotelflow.hu")
                .wing(medenceSzarny)
                .build());

        // ── 3. SZOBÁK (8 db) ───────────────────────────────────────────────
        // Főépület
        Room f101 = roomRepository.save(Room.builder()
                .roomNumber("F-101")
                .wing(foepulet)
                .type(RoomType.STANDARD)
                .pricePerNight(new BigDecimal("18900"))
                .capacity(2)
                .build());

        Room f102 = roomRepository.save(Room.builder()
                .roomNumber("F-102")
                .wing(foepulet)
                .type(RoomType.DELUXE)
                .pricePerNight(new BigDecimal("27500"))
                .capacity(2)
                .build());

        Room f201 = roomRepository.save(Room.builder()
                .roomNumber("F-201")
                .wing(foepulet)
                .type(RoomType.STANDARD)
                .pricePerNight(new BigDecimal("18900"))
                .capacity(3)
                .build());

        // Medence-szárny
        Room m101 = roomRepository.save(Room.builder()
                .roomNumber("M-101")
                .wing(medenceSzarny)
                .type(RoomType.DELUXE)
                .pricePerNight(new BigDecimal("34900"))
                .capacity(2)
                .build());

        Room m102 = roomRepository.save(Room.builder()
                .roomNumber("M-102")
                .wing(medenceSzarny)
                .type(RoomType.SUITE)
                .pricePerNight(new BigDecimal("54900"))
                .capacity(4)
                .build());

        // Penthouse-szárny
        Room p001 = roomRepository.save(Room.builder()
                .roomNumber("P-001")
                .wing(pentHouseSzarny)
                .type(RoomType.PENTHOUSE)
                .pricePerNight(new BigDecimal("129000"))
                .capacity(2)
                .build());

        Room p002 = roomRepository.save(Room.builder()
                .roomNumber("P-002")
                .wing(pentHouseSzarny)
                .type(RoomType.SUITE)
                .pricePerNight(new BigDecimal("79000"))
                .capacity(3)
                .build());

        // Extra szoba – törölhető (nincs aktív foglalása)
        roomRepository.save(Room.builder()
                .roomNumber("F-999")
                .wing(foepulet)
                .type(RoomType.STANDARD)
                .pricePerNight(new BigDecimal("15000"))
                .capacity(1)
                .build());

        // ── 4. VENDÉGEK (7 db) ─────────────────────────────────────────────
        Guest vendeg1 = guestRepository.save(Guest.builder()
                .name("Kovács János")
                .passportNumber("HU123456")
                .email("kovacs.janos@email.hu")
                .tier(GuestTier.GOLD)
                .build());

        Guest vendeg2 = guestRepository.save(Guest.builder()
                .name("Szabó Mária")
                .passportNumber("HU234567")
                .email("szabo.maria@email.hu")
                .tier(GuestTier.PLATINUM)
                .build());

        Guest vendeg3 = guestRepository.save(Guest.builder()
                .name("Horváth László")
                .passportNumber("HU345678")
                .email("horvath.laszlo@email.hu")
                .tier(GuestTier.SILVER)
                .build());

        Guest vendeg4 = guestRepository.save(Guest.builder()
                .name("Tóth Katalin")
                .passportNumber("HU456789")
                .email("toth.katalin@email.hu")
                .tier(GuestTier.STANDARD)
                .build());

        Guest vendeg5 = guestRepository.save(Guest.builder()
                .name("Fekete Péter")
                .passportNumber("DE789012")
                .email("peter.fekete@gmail.com")
                .tier(GuestTier.GOLD)
                .build());

        Guest vendeg6 = guestRepository.save(Guest.builder()
                .name("Claire Dubois")
                .passportNumber("FR112233")
                .email("claire.dubois@mail.fr")
                .tier(GuestTier.PLATINUM)
                .build());

        // Extra vendég – törölhető (nincs aktív foglalása, csak lezártak/cancelled)
        Guest torolehetoVendeg = guestRepository.save(Guest.builder()
                .name("Test Elek")
                .passportNumber("HU999999")
                .email("test.elek@test.hu")
                .tier(GuestTier.STANDARD)
                .build());

        // ── 5. FOGLALÁSOK ──────────────────────────────────────────────────

        LocalDate ma = LocalDate.now();

        // ACTIVE foglalások (3 db)
        Booking aktiv1 = bookingRepository.save(Booking.builder()
                .guest(vendeg1)
                .room(f101)
                .checkInDate(ma.minusDays(2))
                .checkOutDate(ma.plusDays(3))
                .status(BookingStatus.ACTIVE)
                .build());

        Booking aktiv2 = bookingRepository.save(Booking.builder()
                .guest(vendeg2)
                .room(p001)
                .checkInDate(ma.minusDays(1))
                .checkOutDate(ma.plusDays(5))
                .status(BookingStatus.ACTIVE)
                .build());

        Booking aktiv3 = bookingRepository.save(Booking.builder()
                .guest(vendeg5)
                .room(m102)
                .checkInDate(ma)
                .checkOutDate(ma.plusDays(4))
                .status(BookingStatus.ACTIVE)
                .build());

        // PENDING foglalások (2 db) – lehet check-in-elni vagy lemondani
        Booking pending1 = bookingRepository.save(Booking.builder()
                .guest(vendeg3)
                .room(f102)
                .checkInDate(ma.plusDays(2))
                .checkOutDate(ma.plusDays(6))
                .status(BookingStatus.PENDING)
                .build());

        Booking pending2 = bookingRepository.save(Booking.builder()
                .guest(vendeg6)
                .room(p002)
                .checkInDate(ma.plusDays(1))
                .checkOutDate(ma.plusDays(7))
                .status(BookingStatus.PENDING)
                .build());

        // CHECKED_OUT foglalások (2 db) – ezekhez lehet/van review
        Booking checkedOut1 = bookingRepository.save(Booking.builder()
                .guest(vendeg4)
                .room(m101)
                .checkInDate(ma.minusDays(10))
                .checkOutDate(ma.minusDays(7))
                .status(BookingStatus.CHECKED_OUT)
                .build());

        Booking checkedOut2 = bookingRepository.save(Booking.builder()
                .guest(vendeg1)
                .room(f201)
                .checkInDate(ma.minusDays(20))
                .checkOutDate(ma.minusDays(15))
                .status(BookingStatus.CHECKED_OUT)
                .build());

        // CANCELLED foglalás (1 db)
        Booking cancelled1 = bookingRepository.save(Booking.builder()
                .guest(torolehetoVendeg)
                .room(f101)
                .checkInDate(ma.minusDays(5))
                .checkOutDate(ma.minusDays(3))
                .status(BookingStatus.CANCELLED)
                .build());

        // Törölhető vendégnek csak cancelled foglalása van → törölhető
        // (az ACTIVE check nem blokkolja)

        // ── 6. ÉRTÉKELÉSEK (2 db – csak CHECKED_OUT-hoz) ──────────────────
        reviewRepository.save(Review.builder()
                .booking(checkedOut1)
                .stars(5)
                .comment("Tökéletes tartózkodás! A szoba gyönyörű volt, a személyzet rendkívül figyelmes. Biztosan visszatérünk!")
                .specialRequests("Korán érkező check-in kérés teljesítve – köszönjük!")
                .build());

        reviewRepository.save(Review.builder()
                .booking(checkedOut2)
                .stars(4)
                .comment("Kellemes élmény, a reggeli kiváló volt. A szoba kicsit kisebb volt az elvártnál, de összességében elégedett vagyok.")
                .specialRequests("Pezsgő és gyümölcskosár az érkezéskor – szépen köszönjük!")
                .build());

        // ── 7. SZOLGÁLTATÁSKÉRÉSEK (6 db) ─────────────────────────────────
        // Múltbeli dátumú kérések – ezek NEM blokkolják a staff törlését
        // (StaffServiceImpl csak jövőbeli dátumot ellenőriz)
        serviceRequestRepository.save(ServiceRequest.builder()
                .guest(vendeg1)
                .assignedStaff(haziasszony1)
                .requestDate(ma.minusDays(1))
                .type(ServiceType.HOUSEKEEPING)
                .description("Extra törölközők és ágyneműcsere kérése")
                .build());

        serviceRequestRepository.save(ServiceRequest.builder()
                .guest(vendeg2)
                .assignedStaff(concierge1)
                .requestDate(ma.minusDays(1))
                .type(ServiceType.CONCIERGE)
                .description("Vacsorafoglalás a közeli Michelin-csillagos étterembe, 2 fő részére")
                .build());

        serviceRequestRepository.save(ServiceRequest.builder()
                .guest(vendeg2)
                .assignedStaff(recepcios1)
                .requestDate(ma)
                .type(ServiceType.ROOM_SERVICE)
                .description("Reggeliztetés a szobába – kontinentális reggeli champagne-nal")
                .build());

        serviceRequestRepository.save(ServiceRequest.builder()
                .guest(vendeg5)
                .assignedStaff(haziasszony2)
                .requestDate(ma)
                .type(ServiceType.HOUSEKEEPING)
                .description("Szoba takarítás 14:00 után kérve")
                .build());

        serviceRequestRepository.save(ServiceRequest.builder()
                .guest(vendeg3)
                .assignedStaff(recepcios2)
                .requestDate(ma.plusDays(2))
                .type(ServiceType.CONCIERGE)
                .description("Reptéri transzfer foglalása az érkezés napjára, 3 bőrönd")
                .build());

        // Ez a jövőbeli kérés blokkolja recepcios2 törlését → jó teszt eset
        serviceRequestRepository.save(ServiceRequest.builder()
                .guest(vendeg6)
                .assignedStaff(recepcios2)
                .requestDate(ma.plusDays(3))
                .type(ServiceType.SPA)
                .description("Spa időpont foglalása: masszázs + arckezelés csomag")
                .build());

        // torolehetoStaff-nak NINCS service requestje → törölhető

        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "message", List.of(
                        "4 szárny létrehozva (1 törölhető: Keleti-szárny – nincs szoba/személyzet)",
                        "7 személyzet létrehozva (1 törölhető: Papp Réka – nincs service request)",
                        "8 szoba létrehozva (1 törölhető: F-999 – nincs aktív foglalás)",
                        "7 vendég létrehozva (1 törölhető: Test Elek – nincs aktív foglalás)",
                        "8 foglalás: 3 ACTIVE, 2 PENDING, 2 CHECKED_OUT, 1 CANCELLED",
                        "2 értékelés (★★★★★ és ★★★★) a lezárt foglalásokhoz",
                        "6 szolgáltatáskérés (recepcios2 NEM törölhető – jövőbeli kérése van)"
                )
        ));
    }
}