package com.hotelflow.mappers;

import com.hotelflow.dto.staff.StaffResponseDto;
import com.hotelflow.model.Staff;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StaffMapper {

    public List<StaffResponseDto> toStaffResponseDtoList(List<Staff> staffList) {
        return staffList.stream()
                .map(this::toStaffResponseDto).toList();
    }

    public StaffResponseDto toStaffResponseDto(Staff staff) {
        return new StaffResponseDto(
                staff.getId(),
                staff.getName(),
                staff.getRole(),
                staff.getEmail(),
                staff.getWing().getId()
        );
    }

}
