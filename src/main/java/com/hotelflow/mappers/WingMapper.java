package com.hotelflow.mappers;

import com.hotelflow.dto.wing.WingResponseDto;
import com.hotelflow.model.Room;
import com.hotelflow.model.Staff;
import com.hotelflow.model.Wing;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WingMapper {

    public List<WingResponseDto> toWingResponseDtoList(List<Wing> wings) {
        return wings.stream()
                .map(this::toWingResponseDto).toList();
    }

    public WingResponseDto toWingResponseDto(Wing wing) {
        return new WingResponseDto(
                wing.getId(),
                wing.getName(),
                wing.getDescription(),
                wing.getManagerName(),
                wing.getStaff().size(),
                wing.getRooms().size()
        );
    }

}
