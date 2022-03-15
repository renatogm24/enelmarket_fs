package com.codingdojo.springjwt.models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity @Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
public class ProductOrder {
	
	@Id @GeneratedValue(strategy = GenerationType.AUTO)
	private Long idProductOrder;
	
	private Long id;
	
	private String url;
	
	private String name;
	
	private String variante;
	
	private Double precio;
	
	private Double descuento;
	
	private Double subtotal;
	
	private Integer cantidad;
	
	private Double total;
	
	//@JsonIgnoreProperties
	@JsonBackReference(value="ordercart-productOrder")
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="order_id")
	private Ordercart ordercart;
}
