package com.codingdojo.springjwt.models;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity @Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
public class Variant {

	@Id @GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotBlank(message = "Campo obligatorio")
	private String name;
	
	@JsonBackReference(value="producto-variants")
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="producto_id")
	private Producto producto;
	
	@JsonManagedReference(value="variant-optionvar")
	@OneToMany(mappedBy="variant", cascade=CascadeType.ALL, fetch = FetchType.LAZY)
	private List<OptionVar> optionsVar;
	
}
