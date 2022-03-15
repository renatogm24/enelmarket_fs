package com.codingdojo.springjwt.models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity @Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
public class Ordercart {

	@Id @GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotBlank(message = "Campo obligatorio")
    private String name;

	@NotBlank(message = "Campo obligatorio")
    private String lastname;
	
	@NotBlank(message = "Campo obligatorio")
    private String email;
	
	@NotBlank(message = "Campo obligatorio")
    private String phone;
	
	@NotBlank(message = "Campo obligatorio")
    private String address;
	
	@NotBlank(message = "Campo obligatorio")
    private String zona;
	
	@NotBlank(message = "Campo obligatorio")
    private String envioMetodo;
	
	private Double envioCosto;
	
	@NotBlank(message = "Campo obligatorio")
    private String pagoMetodo;
	
	private String pagoCodigo;
	
	private Double subtotal;
	
	private String estado = "pendiente";
	
	@JsonManagedReference(value="ordercart-productOrder")
	@OneToMany(mappedBy="ordercart", fetch = FetchType.LAZY)
	private List<ProductOrder> productosdb;
	
	
	@Transient
	private List<ProductOrder> productos;
	
	private String namePay;
	private String lastnamePay;
	private String phonePay;
	
	@JsonBackReference(value="store-orders")
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="store_id")
	private Store store;
	
	@Transient
	private String storeName;
	
	
}
