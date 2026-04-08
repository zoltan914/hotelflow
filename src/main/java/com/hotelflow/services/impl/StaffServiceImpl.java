package com.hotelflow.services.impl;

import com.hotelflow.dto.staff.StaffCreateDto;
import com.hotelflow.dto.staff.StaffUpdateDto;
import com.hotelflow.model.ServiceRequest;
import com.hotelflow.model.Staff;
import com.hotelflow.model.Wing;
import com.hotelflow.repository.ServiceRequestRepository;
import com.hotelflow.repository.StaffRepository;
import com.hotelflow.services.StaffService;
import com.hotelflow.services.WingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;
    private final WingService wingService;
    private final ServiceRequestRepository serviceRequestRepository;

    @Override
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @Override
    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Az alkalmazott nem található: " + id));
    }

    @Override
    public Staff createStaff(StaffCreateDto request) {
        Wing wing = wingService.getWingById(request.wingId());
        Staff staff = Staff.builder()
                .name(request.name())
                .role(request.role())
                .email(request.email())
                .wing(wing)
                .build();
        return staffRepository.save(staff);
    }

    @Override
    public Staff updateStaff(Long id, StaffUpdateDto request) {
        Staff staff = getStaffById(id);
        staff.setName(request.name() != null ? request.name() : staff.getName());
        staff.setRole(request.role() != null ? request.role() : staff.getRole());
        staff.setEmail(request.email() != null ? request.email() : staff.getEmail());
        if (request.wingId() != null) {
            staff.setWing(wingService.getWingById(request.wingId()));
        }
        return staffRepository.save(staff);
    }

    @Override
    @Transactional
    public void deleteStaff(Long id) {
        Staff staff = getStaffById(id);
        List<ServiceRequest> serviceRequests = staff.getServiceRequests();
        boolean hasActiveServiceRequest = serviceRequests.stream()
                .anyMatch(req -> req.getRequestDate().isAfter(LocalDate.now().minusDays(1)));
        if (hasActiveServiceRequest) {
            throw new IllegalStateException("Az alkalmazott nem törölhető, mert van aktív szolgáltatáskérése a jövőben");
        }
        staffRepository.delete(staff);
    }
}
