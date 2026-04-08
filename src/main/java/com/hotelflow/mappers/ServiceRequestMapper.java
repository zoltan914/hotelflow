package com.hotelflow.mappers;

import com.hotelflow.dto.services.ServiceRequestResponseDto;
import com.hotelflow.model.ServiceRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ServiceRequestMapper {

    public List<ServiceRequestResponseDto> toServiceRequestResponseDtoList(List<ServiceRequest> serviceRequests) {
        return serviceRequests.stream()
                .map(this::toServiceRequestResponseDto).toList();
    }

    public ServiceRequestResponseDto toServiceRequestResponseDto(ServiceRequest serviceRequest) {
        return new ServiceRequestResponseDto(
                serviceRequest.getId(),
                serviceRequest.getGuest().getId(),
                serviceRequest.getAssignedStaff().getId(),
                serviceRequest.getRequestDate(),
                serviceRequest.getType(),
                serviceRequest.getDescription()
        );
    }

}
