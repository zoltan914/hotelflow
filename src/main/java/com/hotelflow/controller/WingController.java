package com.hotelflow.controller;

import com.hotelflow.dto.wing.WingCreateDto;
import com.hotelflow.dto.wing.WingResponseDto;
import com.hotelflow.dto.wing.WingUpdateDto;
import com.hotelflow.mappers.WingMapper;
import com.hotelflow.model.Wing;
import com.hotelflow.services.WingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wings")
@RequiredArgsConstructor
public class WingController {

    private final WingService wingService;
    private final WingMapper wingMapper;

    @GetMapping
    public ResponseEntity<List<WingResponseDto>> getAllWings() {
        List<Wing> wings = wingService.getAllWings();
        return ResponseEntity.ok(wingMapper.toWingResponseDtoList(wings));
    }

    @PostMapping
    public ResponseEntity<WingResponseDto> createWing(
            @Valid @RequestBody WingCreateDto request
    ) {
        Wing createdWing = wingService.createWing(request);
        return ResponseEntity.ok(wingMapper.toWingResponseDto(createdWing));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WingResponseDto> updateWing(
            @PathVariable Long id,
            @RequestBody WingUpdateDto request
    ) {
        Wing updatedWing = wingService.updateWing(id, request);
        return ResponseEntity.ok(wingMapper.toWingResponseDto(updatedWing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWing(
            @PathVariable Long id
    ) {
        wingService.deleteWing(id);
        return ResponseEntity.noContent().build();
    }


}
