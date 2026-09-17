package com.smartinventory.smart_inventory.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String username;
    private String email;
    private String password;
}