package com.codingdojo.springjwt.models;


import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity @Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
public class Store {
	@Id @GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Size(min = 3,message = "Nombre minimo 3 letras")
	private String name;
	
	@JsonBackReference(value="user-store")
	@OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id")
	private User user;
	
	@JsonManagedReference(value="store-portada")
	@OneToOne(mappedBy="store_owner_portada", cascade=CascadeType.ALL, fetch=FetchType.LAZY)
	private Image portada_img;
	@JsonManagedReference(value="store-imagen")
	@OneToOne(mappedBy="store_owner_logo", cascade=CascadeType.ALL, fetch=FetchType.LAZY)
	private Image logo_img;
	
	@JsonManagedReference(value="store-categories")
	@OneToMany(mappedBy="store", fetch = FetchType.LAZY)
	private List<Category> categories;
	
	@JsonManagedReference(value="store-cobros")
	@OneToMany(mappedBy="storeCobro", fetch = FetchType.LAZY)
	private List<Cobro> cobros;
	
	@JsonManagedReference(value="store-envios")
	@OneToMany(mappedBy="storeEnvio", fetch = FetchType.LAZY)
	private List<Envio> envios;
	
	@JsonManagedReference(value="store-orders")
	@OneToMany(mappedBy="store", fetch = FetchType.LAZY)
	private List<Ordercart> ordercarts;
}
