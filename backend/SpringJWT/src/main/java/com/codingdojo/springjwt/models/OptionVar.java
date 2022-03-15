package com.codingdojo.springjwt.models;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity @Setter @Getter @ToString @NoArgsConstructor @AllArgsConstructor
public class OptionVar {

	@Id @GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotBlank(message = "Campo obligatorio")
	private String name;
	
	@JsonBackReference(value="variant-optionvar")
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="variant_id")
	private Variant variant;
}
