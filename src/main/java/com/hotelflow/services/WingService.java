package com.hotelflow.services;

import com.hotelflow.dto.wing.WingCreateDto;
import com.hotelflow.dto.wing.WingUpdateDto;
import com.hotelflow.model.Wing;

import java.util.List;

public interface WingService {
    List<Wing> getAllWings();
    Wing getWingById(Long id);
    Wing createWing(WingCreateDto request);
    Wing updateWing(Long id, WingUpdateDto request);
    void deleteWing(Long id);
}
