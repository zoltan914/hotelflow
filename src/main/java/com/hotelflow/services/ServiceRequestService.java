package com.hotelflow.services;

import com.hotelflow.dto.services.ServiceRequestCreateDto;
import com.hotelflow.model.ServiceRequest;

import java.util.List;

public interface ServiceRequestService {
    List<ServiceRequest> getAllServiceRequests();
    ServiceRequest getServiceRequestById(Long id);
    ServiceRequest createServiceRequest(ServiceRequestCreateDto request);
    void deleteServiceRequest(Long id);
}
