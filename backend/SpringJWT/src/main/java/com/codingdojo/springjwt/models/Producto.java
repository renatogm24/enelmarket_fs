package com.codingdojo.springjwt.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Transient;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.JoinColumn;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity @Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
public class Producto {

	@Id @GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotBlank(message = "Campo obligatorio")
    private String name;
	
	private Double precio;
	
	private Double descuento;
	
	@JsonIgnoreProperties("productos")
	@ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "category_producto",
        joinColumns = @JoinColumn(name = "producto_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
	private List<Category> categories;
	
	@Transient
	private List<String> categoriesForm;
	
	
	@JsonManagedReference(value="producto-variants")
	@OneToMany(mappedBy="producto", cascade=CascadeType.ALL,fetch = FetchType.LAZY)
	private List<Variant> variants;
	
	@JsonManagedReference(value="producto-combinatories")
	@OneToMany(mappedBy="producto", cascade=CascadeType.ALL,fetch = FetchType.LAZY)
	private List<Combinatorie> combinatories;

	
	@Transient
	private List<String> variantsForm;
	
	@Transient
	private List<List<String>> variantsOptions;
	
	@Transient
	private List<List<String>> variantsCombinatories;
	
	@JsonManagedReference(value="producto-imagen")
	@OneToOne(mappedBy="producto", cascade=CascadeType.ALL, fetch=FetchType.LAZY)
	private Image producto_img;
	
	public void deleteCategory(Category catToDelete) {
		this.getCategories().remove(catToDelete);
	}
	
	public void deleteVariant(Variant varToDelete) {
		this.getVariants().remove(varToDelete);
	}
	
}
