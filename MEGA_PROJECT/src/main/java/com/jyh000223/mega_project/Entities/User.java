package com.jyh000223.mega_project.Entities;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "USER_TABLE")
@Getter
@Setter
public class User {
    @Id
    @Column(name="USER_ID")
    private String user_id;
    @Column(name="PASSWORD")
    private String password;
    @Column(name="USER_NAME")
    private String user_name;
    @Column(name="EMAIL_ADDRESS")
    private String email_address;
}
