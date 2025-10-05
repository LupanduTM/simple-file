
package com.gocashless.ums.dto;

import com.gocashless.ums.model.UserStatus;
import lombok.Data;

@Data
public class UserStatusUpdateRequest {
    private UserStatus status;
}
