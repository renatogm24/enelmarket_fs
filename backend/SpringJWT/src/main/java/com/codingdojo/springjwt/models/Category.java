package com.codingdojo.springjwt.models;


import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;

import com.codingdojo.springjwt.validators.UniqueCategory;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity @Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
public class Category {
	@Id @GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotBlank(message = "Campo obligatorio")
    private String name;
	
	private Integer orderCat;
	
	@JsonBackReference(value="store-categories")
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="store_id")
	private Store store;
	
	@JsonIgnoreProperties("categories")
	@ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "category_producto",
        joinColumns = @JoinColumn(name = "category_id"),
        inverseJoinColumns = @JoinColumn(name = "producto_id")
    )
	private List<Producto> productos;
}
