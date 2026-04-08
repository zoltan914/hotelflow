package com.hotelflow.controller;

import com.hotelflow.dto.services.ServiceRequestCreateDto;
import com.hotelflow.dto.services.ServiceRequestResponseDto;
import com.hotelflow.mappers.ServiceRequestMapper;
import com.hotelflow.model.ServiceRequest;
import com.hotelflow.services.ServiceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;
    private final ServiceRequestMapper serviceRequestMapper;

    @GetMapping
    public ResponseEntity<List<ServiceRequestResponseDto>> getAllServiceRequests() {
        List<ServiceRequest>  serviceRequests = serviceRequestService.getAllServiceRequests();
        return  ResponseEntity.ok().body(serviceRequestMapper.toServiceRequestResponseDtoList(serviceRequests));
    }

    @PostMapping
    public ResponseEntity<ServiceRequestResponseDto> createServiceRequest(
            @RequestBody ServiceRequestCreateDto request
    ) {
        ServiceRequest serviceRequest = serviceRequestService.createServiceRequest(request);
        return  ResponseEntity.ok().body(serviceRequestMapper.toServiceRequestResponseDto(serviceRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteServiceRequest(
            @PathVariable Long id
    ) {
        serviceRequestService.deleteServiceRequest(id);
        return ResponseEntity.noContent().build();
    }
}
