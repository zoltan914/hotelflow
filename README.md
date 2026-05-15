# 🏨 HotelFlow – Szálloda Foglaláskezelő Rendszer
## Projekt Brief – React + Spring Boot Fullstack Feladat

---

## A megoldandó probléma leírása

Képzeljünk el egy szállodai foglaláskezelő rendszert, amelyet egy közepes méretű szálloda
recepciós és adminisztrációs csapata használ. A szállodában **több szárny / épületrész**
(pl. Főépület, Medence-szárny, Penthouse) található, amelyekben **szobák** helyezkednek el.
A vendégek **foglalást** kötnek egy adott szobára, **bejelentkeznek** és **kijelentkeznek**.
Minden foglaláshoz tartozhat egy **értékelés** (szöveges visszajelzés + csillag).

---

## Adatmodell (7 entitás)

| Entitás | Leírás |
|---------|--------|
| `Wing` | Szárny / épületrész: név, leírás, szárnyvezető neve |
| `Staff` | Személyzet: név, beosztás (`enum`), email, szárny (`@ManyToOne`) |
| `Guest` | Vendég: név, útlevélszám (egyedi), email, vendégkategória (`enum`) |
| `Room` | Szoba: szobaszám (egyedi szárnyonként), szárny (`@ManyToOne`), típus (`enum`), ár/éj, férőhely |
| `Booking` | Foglalás: vendég, szoba, érkezés dátuma, távozás dátuma, státusz (`enum`: PENDING / ACTIVE / CHECKED_OUT / CANCELLED) |
| `ServiceRequest` | Szolgáltatáskérés: vendég, személyzet, dátum, típus (`enum`), leírás |
| `Review` | Értékelés: foglalás (`@OneToOne`), csillag (1–5), szöveges visszajelzés, különleges kérések megjegyzése |

**Kapcsolatok:**
- `Staff` → `Wing` (`@ManyToOne`)
- `Room` → `Wing` (`@ManyToOne`)
- `Booking` → `Guest` + `Room` (`@ManyToOne`)
- `ServiceRequest` → `Guest` + `Staff` (`@ManyToOne`)
- `Review` → `Booking` (`@OneToOne`)

---

## Enum-ok

```java
// Szoba típusa
enum RoomType { STANDARD, DELUXE, SUITE, PENTHOUSE }

// Foglalás státusza
enum BookingStatus { PENDING, ACTIVE, CHECKED_OUT, CANCELLED }

// Vendégkategória (hűségprogram)
enum GuestTier { STANDARD, SILVER, GOLD, PLATINUM }

// Személyzet beosztása
enum StaffRole { RECEPTIONIST, HOUSEKEEPER, CONCIERGE, MANAGER }

// Szolgáltatáskérés típusa
enum ServiceType { ROOM_SERVICE, HOUSEKEEPING, MAINTENANCE, CONCIERGE, SPA }
```

---

## Funkciók és oldalak

### 1. Szárnyak oldal (`/wings`)
- Szárny létrehozása (név, leírás, szárnyvezető)
- Szerkesztés, törlés (csak ha nincs hozzá tartozó személyzet vagy szoba)
- Kártyás nézet: mutatja a személyzet tagjainak és a szobák számát

### 2. Személyzet oldal (`/staff`)
- Alkalmazott felvétele (név, beosztás, email, szárny)
- Szerkesztés, törlés (csak ha nincs hozzá rendelt aktív szolgáltatáskérése)
- Kártyás nézet: badge-dzsel jelzi a szárnyat és beosztást
- Szűrés szárny szerint (filter chip-ek)

### 3. Vendégek oldal (`/guests`)
- Vendég felvétele (név, útlevélszám, email, vendégkategória)
- Szerkesztés, törlés (csak ha nincs aktív foglalása)
- Útlevélszám egyedi – duplikáció esetén 409 Conflict
- Kártyás nézet: mutatja az aktív foglalás státuszát, vendégkategória badge-et, foglalások számát

### 4. Szobák oldal (`/rooms`)
- Szoba létrehozása (szobaszám, szárny, típus, ár/éj, férőhely)
- Szerkesztés, törlés (csak ha nincs aktív foglalása)
- Típusjelző badge: STANDARD / DELUXE / SUITE / PENTHOUSE
- Kapacitásjelző sáv: aktuálisan foglalt éjszakák / max férőhely
- Szűrés szárny és típus szerint
- Ár/éj megjelenítése `price-tag` osztállyal

### 5. Foglalások oldal (`/bookings`)
- Új foglalás: vendég + szoba + érkezés/távozás dátuma
  → ellenőrzés: a szobára nincs-e átfedő aktív foglalás a megadott időszakra
  → ellenőrzés: a vendégnek nincs-e már ACTIVE foglalása
  → státusz: PENDING
- Check-in: PENDING → ACTIVE (csak az érkezés napján vagy után)
- Check-out: ACTIVE → CHECKED_OUT (távozás dátumának rögzítése)
- Lemondás: PENDING → CANCELLED
- Táblázat: aktív, függőben lévő, lezárt/lemondott foglalások külön szekcióban
- Szűrés szárny / szoba / vendég szerint

### 6. Szolgáltatáskérések oldal (`/services`)
- Új kérés: vendég + személyzet + dátum + típus + leírás
- Kéréshez értékelés / megjegyzés hozzáadása inline
- Szűrés típus és személyzet szerint
- Ha a vendég GOLD vagy PLATINUM kategóriájú, kiemelés badge-dzsel

### 7. Szimuláció (`/simulation`)
Gombra kattintva töltse fel az adatbázist:
- 3 szárny (Főépület, Medence-szárny, Penthouse)
- 6 szoba (szárnyanként 2, különböző típusokkal és árakkal)
- 4 személyzet tag (recepciós, háziasszony, concierge, manager)
- 5 vendég különböző vendégkategóriával (STANDARD → PLATINUM)
- 3 aktív foglalás, 1 lezárt (CHECKED_OUT), 1 lemondott (CANCELLED)
- 4 szolgáltatáskérés különböző típusokkal
- 2 foglaláshoz tartozó értékelés (4★ és 5★)

---

## Technikai követelmények

### Backend (Spring Boot)
- Java 17+, Spring Boot 3.x, Maven
- JPA + Hibernate, H2 in-memory adatbázis
- Service réteg, DTO-k, Mapper-ek, Repository réteg
- `@Transactional` összetett műveleteknél
- `GlobalExceptionHandler`: `EntityNotFoundException` → 404, `IllegalStateException` + `IllegalArgumentException` → 400
- CORS konfiguráció
- Indítás: `mvn spring-boot:run`

### Frontend (React + TypeScript)
- Vite + React 18 + TypeScript
- React Router, Axios, Toast Context
- Ne használj inline style-okat – csak a mellékelt `App.css` osztályait
- Lokális state frissítés minden művelet után
- `loading` és `actionLoading` state minden oldalon

---

## API végpontok (ajánlott)

```
GET/POST         /api/wings
PUT/DELETE       /api/wings/{id}

GET/POST         /api/staff
PUT/DELETE       /api/staff/{id}

GET/POST         /api/guests
PUT/DELETE       /api/guests/{id}

GET/POST         /api/rooms
PUT/DELETE       /api/rooms/{id}

GET              /api/bookings
GET              /api/bookings/active
POST             /api/bookings                        ← új foglalás
PUT              /api/bookings/{id}/checkin           ← check-in
PUT              /api/bookings/{id}/checkout          ← check-out
PUT              /api/bookings/{id}/cancel            ← lemondás

GET              /api/services
POST             /api/services
DELETE           /api/services/{id}

POST             /api/bookings/{id}/review            ← értékelés hozzáadása
PUT              /api/bookings/{id}/review            ← értékelés módosítása

POST             /api/simulation
```

---

## Üzleti szabályok

1. Útlevélszám egyedi – duplikáció esetén érthető hibaüzenet
2. Szobaszám egyedi szárnyon belül (két különböző szárny rendelkezhet 101-es szobával)
3. Foglalásnál: ha a szobára van átfedő ACTIVE vagy PENDING foglalás → 400 hiba
4. Foglalásnál: ha a vendégnek már van ACTIVE foglalása → 400 hiba
5. Check-in: csak PENDING státuszú foglalást lehet bejelentkeztetni → különben 400 hiba
6. Check-out: csak ACTIVE foglalást lehet kijelentkeztetni → különben 400 hiba
7. Lemondás: csak PENDING foglalás mondható le → különben 400 hiba
8. Személyzet törlése: ha van hozzá rendelt szolgáltatáskérés → 400 hiba
9. Szárny törlése: ha van hozzá tartozó személyzet VAGY szoba → 400 hiba
10. Szoba törlése: ha van aktív foglalása → 400 hiba
11. Vendég törlése: ha van aktív foglalása → 400 hiba
12. Értékelés: egy foglaláshoz csak egy értékelés adható – második hozzáadásnál 400 hiba
13. Értékelés csak CHECKED_OUT státuszú foglaláshoz adható → különben 400 hiba

---

## Entitások részletes leírása

### `Wing` (Szárny)
```java
@Entity
public class Wing {
    @Id @GeneratedValue
    private Long id;
    private String name;           // pl. "Medence-szárny"
    private String description;
    private String managerName;    // szárnyvezető
}
```

### `Staff` (Személyzet)
```java
public enum StaffRole { RECEPTIONIST, HOUSEKEEPER, CONCIERGE, MANAGER }

@Entity
public class Staff {
    @Id @GeneratedValue
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING)
    private StaffRole role;
    private String email;
    @ManyToOne
    private Wing wing;
}
```

### `Guest` (Vendég)
```java
public enum GuestTier { STANDARD, SILVER, GOLD, PLATINUM }

@Entity
public class Guest {
    @Id @GeneratedValue
    private Long id;
    private String name;
    @Column(unique = true)
    private String passportNumber;
    private String email;
    @Enumerated(EnumType.STRING)
    private GuestTier tier;
}
```

### `Room` (Szoba)
```java
public enum RoomType { STANDARD, DELUXE, SUITE, PENTHOUSE }

@Entity
public class Room {
    @Id @GeneratedValue
    private Long id;
    private String roomNumber;
    @ManyToOne
    private Wing wing;
    @Enumerated(EnumType.STRING)
    private RoomType type;
    private BigDecimal pricePerNight;
    private int capacity;
}
```

### `Booking` (Foglalás)
```java
public enum BookingStatus { PENDING, ACTIVE, CHECKED_OUT, CANCELLED }

@Entity
public class Booking {
    @Id @GeneratedValue
    private Long id;
    @ManyToOne
    private Guest guest;
    @ManyToOne
    private Room room;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}
```

### `ServiceRequest` (Szolgáltatáskérés)
```java
public enum ServiceType { ROOM_SERVICE, HOUSEKEEPING, MAINTENANCE, CONCIERGE, SPA }

@Entity
public class ServiceRequest {
    @Id @GeneratedValue
    private Long id;
    @ManyToOne
    private Guest guest;
    @ManyToOne
    private Staff assignedStaff;
    private LocalDate requestDate;
    @Enumerated(EnumType.STRING)
    private ServiceType type;
    private String description;
}
```

### `Review` (Értékelés)
```java
@Entity
public class Review {
    @Id @GeneratedValue
    private Long id;
    @OneToOne
    @JoinColumn(name = "booking_id", unique = true)
    private Booking booking;
    private int stars;              // 1–5
    private String comment;         // szöveges visszajelzés
    private String specialRequests; // különleges kérések megjegyzése
}
```

---

## Értékelési szempontok

1. Az adatmodell helyessége (különösen a `@OneToOne` Review ↔ Booking kapcsolat)
2. Foglalási átfedés-ellenőrzés helyes implementációja (dátum-intervallum metszet)
3. Státuszgép következetes betartása (PENDING → ACTIVE → CHECKED_OUT)
4. `@Transactional` helyes használata
5. Frontend állapotkezelés: lokális frissítés, loading state-ek, filter chip-ek
6. Kódminőség, ismétlések elkerülése
7. Edge case-ek: dátum-átfedés, dupla check-in kísérlete, értékelés csak CHECKED_OUT után

---

## Toast üzenetek (példák)

| Esemény | Toast |
|---------|-------|
| Foglalás létrehozva | ✅ "Foglalás sikeresen rögzítve – 302-es szoba, 2025.06.14–17." |
| Átfedő foglalás | ❌ "A szoba a megadott időszakra már foglalt" |
| Check-in sikeres | ✅ "Kovács János bejelentkezve – jó tartózkodást!" |
| Értékelés hozzáadva | ✅ "Köszönjük a visszajelzést! ★★★★★" |
| Dupla útlevélszám | ❌ "Ez az útlevélszám már regisztrálva van" |
| Szoba törlése sikertelen | ❌ "A szoba nem törölhető, mert aktív foglalása van" |
| Szimuláció kész | ✅ "Az adatbázis sikeresen feltöltve" |

---

## Projekt struktúra (Backend)

```
src/
├── main/
│   ├── java/hu/hotelflow/
│   │   ├── controller/
│   │   │   ├── WingController.java
│   │   │   ├── StaffController.java
│   │   │   ├── GuestController.java
│   │   │   ├── RoomController.java
│   │   │   ├── BookingController.java
│   │   │   ├── ServiceRequestController.java
│   │   │   └── SimulationController.java
│   │   ├── service/
│   │   │   ├── WingService.java
│   │   │   ├── StaffService.java
│   │   │   ├── GuestService.java
│   │   │   ├── RoomService.java
│   │   │   ├── BookingService.java
│   │   │   ├── ServiceRequestService.java
│   │   │   └── SimulationService.java
│   │   ├── repository/
│   │   ├── model/
│   │   ├── dto/
│   │   ├── mapper/
│   │   └── exception/
│   │       └── GlobalExceptionHandler.java
│   └── resources/
│       └── application.properties
```

## Projekt struktúra (Frontend)

```
src/
├── pages/
│   ├── WingsPage.tsx
│   ├── StaffPage.tsx
│   ├── GuestsPage.tsx
│   ├── RoomsPage.tsx
│   ├── BookingsPage.tsx
│   ├── ServicesPage.tsx
│   └── SimulationPage.tsx
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── ToastContext.tsx
├── api/
│   └── axios.ts
├── types/
│   └── index.ts
├── App.tsx
├── App.css        ← mellékelt CSS
└── main.tsx
```
