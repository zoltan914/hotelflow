package com.hotelflow.services.impl;

import com.hotelflow.dto.wing.WingCreateDto;
import com.hotelflow.dto.wing.WingUpdateDto;
import com.hotelflow.model.Room;
import com.hotelflow.model.Staff;
import com.hotelflow.model.Wing;
import com.hotelflow.repository.WingRepository;
import com.hotelflow.services.WingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class WingServiceImpl implements WingService {

    private final WingRepository wingRepository;

    @Override
    public List<Wing> getAllWings() {
        return wingRepository.findAll();
    }

    @Override
    public Wing getWingById(Long id) {
        return wingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("A szárny nem található: " + id));
    }

    @Override
    public Wing createWing(WingCreateDto request) {
        Wing wing = Wing.builder()
                .name(request.name())
                .description(request.description())
                .managerName(request.managerName())
                .build();
        return wingRepository.save(wing);
    }

    @Override
    public Wing updateWing(Long id, WingUpdateDto request) {
        Wing wing = getWingById(id);
        wing.setName(request.name() != null ? request.name() : wing.getName());
        wing.setDescription(request.description() != null ? request.description() : wing.getDescription());
        wing.setManagerName(request.managerName() != null ? request.managerName() : wing.getManagerName());
        return wingRepository.save(wing);
    }

    @Override
    @Transactional
    public void deleteWing(Long id) {
        Wing wing = getWingById(id);
        List<Staff> staff = wing.getStaff();
        List<Room> rooms = wing.getRooms();
        if (!staff.isEmpty() || !rooms.isEmpty()) {
            throw new IllegalStateException("A szárny nem törölhető, mert van hozzárendelet szoba vagy személyzet.");
        }
        wingRepository.delete(wing);
    }
}
