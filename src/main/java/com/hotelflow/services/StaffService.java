package com.hotelflow.services;

import com.hotelflow.dto.staff.StaffCreateDto;
import com.hotelflow.dto.staff.StaffUpdateDto;
import com.hotelflow.model.Staff;

import java.util.List;

public interface StaffService {
    List<Staff> getAllStaff();
    Staff getStaffById(Long id);
    Staff createStaff(StaffCreateDto request);
    Staff updateStaff(Long id, StaffUpdateDto request);
    void deleteStaff(Long id);
}
