package com.codingdojo.springjwt.models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;

import com.codingdojo.springjwt.validators.UniqueCategory;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity @Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
public class Cobro {

	@Id @GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotBlank(message = "Campo obligatorio")
    private String name;
	
	@NotBlank(message = "Campo obligatorio")
    private String cuenta;
	
	@NotBlank(message = "Campo obligatorio")
    private String tipo;
	
	@JsonBackReference(value="store-cobros")
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="store_id")
	private Store storeCobro;
	
}
