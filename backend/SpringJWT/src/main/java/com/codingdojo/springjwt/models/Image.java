package com.codingdojo.springjwt.models;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity @Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
public class Image {
	@Id @GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotNull
    private String url;
	
	@JsonBackReference(value="store-portada")
	@OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="store_portada_id")
	private Store store_owner_portada;
	
	@JsonBackReference(value="store-imagen")
	@OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="store_logo_id")
	private Store store_owner_logo;
	
	@JsonBackReference(value="producto-imagen")
	@OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="producto_id")
	private Producto producto;
}
