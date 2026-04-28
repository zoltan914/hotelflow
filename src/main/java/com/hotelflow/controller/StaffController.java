package com.hotelflow.controller;

import com.hotelflow.dto.staff.StaffCreateDto;
import com.hotelflow.dto.staff.StaffResponseDto;
import com.hotelflow.dto.staff.StaffUpdateDto;
import com.hotelflow.mappers.StaffMapper;
import com.hotelflow.model.Staff;
import com.hotelflow.services.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;
    private final StaffMapper staffMapper;

    @GetMapping
    public ResponseEntity<List<StaffResponseDto>> getAllStaff() {
        List<Staff> staffList = staffService.getAllStaff();
        return ResponseEntity.ok().body(staffMapper.toStaffResponseDtoList(staffList));
    }

    @PostMapping
    public ResponseEntity<StaffResponseDto> createStaff(
            @Valid @RequestBody StaffCreateDto request
    ) {
        Staff staff = staffService.createStaff(request);
        return ResponseEntity.ok(staffMapper.toStaffResponseDto(staff));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffResponseDto> updateStaff(
            @PathVariable Long id,
            @RequestBody StaffUpdateDto request
    ) {
        Staff staff = staffService.updateStaff(id, request);
        return ResponseEntity.ok(staffMapper.toStaffResponseDto(staff));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(
            @PathVariable Long id
    ) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }

}
