package com.jyh000223.mega_project.DTO;

public class UserDTO {
    private String user_id;
    private String password;
    private String user_name;
    private String email_address;

    public String getUser_id(){
        return user_id;
    }
    public void setUser_id(String user_id){

        this.user_id = user_id;
    }
    public String getPassword(){
        return password;
    }
    public void setPassword(String password){
        this.password = password;
    }
    public String getUser_name(){
        return user_name;
    }
    public void setUser_name(String user_name){
        this.user_name = user_name;
    }
    public String getEmail_address(){
        return email_address;
    }
    public void setEmail_address(String email_address){
        this.email_address = email_address;
    }

}
