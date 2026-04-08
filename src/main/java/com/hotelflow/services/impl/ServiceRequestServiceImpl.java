package com.hotelflow.services.impl;

import com.hotelflow.dto.services.ServiceRequestCreateDto;
import com.hotelflow.model.Guest;
import com.hotelflow.model.ServiceRequest;
import com.hotelflow.model.Staff;
import com.hotelflow.repository.ServiceRequestRepository;
import com.hotelflow.services.GuestService;
import com.hotelflow.services.ServiceRequestService;
import com.hotelflow.services.StaffService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ServiceRequestServiceImpl implements ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final GuestService guestService;
    private final StaffService staffService;

    @Override
    public List<ServiceRequest> getAllServiceRequests() {
        return  serviceRequestRepository.findAll();
    }

    @Override
    public ServiceRequest getServiceRequestById(Long id) {
        return serviceRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("A szolgáltatás nem található: " + id));
    }

    @Override
    public ServiceRequest createServiceRequest(ServiceRequestCreateDto request) {
        Guest guest = guestService.getGuestById(request.guestId());
        Staff staff =  staffService.getStaffById(request.staffId());
        ServiceRequest serviceRequest = ServiceRequest.builder()
                .guest(guest)
                .assignedStaff(staff)
                .requestDate(request.requestDate())
                .type(request.type())
                .description(request.description())
                .build();
        return serviceRequestRepository.save(serviceRequest);
    }

    @Override
    @Transactional
    public void deleteServiceRequest(Long id) {
        ServiceRequest serviceRequest = getServiceRequestById(id);
        serviceRequestRepository.delete(serviceRequest);
    }
}
