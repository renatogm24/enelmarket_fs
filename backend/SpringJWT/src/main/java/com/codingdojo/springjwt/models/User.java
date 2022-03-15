package com.codingdojo.springjwt.models;

import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.Transient;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.codingdojo.springjwt.validators.Unique;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity @Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
public class User {
	@Id @GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	@NotBlank(message = "Campo obligatorio")
	private String name;
	@NotBlank(message = "Campo obligatorio")
	private String lastname;
	@Unique(message = "El correo ya está siendo utilizado")
	@Email(message="Ingrese un correo válido!")
	private String username;
	private String password;
	@ManyToMany(fetch = FetchType.EAGER)
	private Collection<Role> roles = new ArrayList<>();
	@JsonManagedReference(value="user-store")
	@OneToOne(mappedBy="user", cascade=CascadeType.ALL, fetch=FetchType.LAZY)
	private Store store;
	@Transient
	private String storeName;
}
