package com.jyh000223.mega_project.DTO;

import lombok.Getter;

@Getter
public class UserDTO {
    private String user_id;
    private String password;
    private String user_name;
    private String email_address;

    public void setUser_id(String user_id){

        this.user_id = user_id;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public void setUser_name(String user_name){
        this.user_name = user_name;
    }

    public void setEmail_address(String email_address){
        this.email_address = email_address;
    }

}
