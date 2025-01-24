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
    @Column(name="user_id")
    private String user_id;
    @Column(name="password")
    private String password;
    @Column(name="user_name")
    private String userName;
    @Column(name="email_address")
    private String email_address;
}
