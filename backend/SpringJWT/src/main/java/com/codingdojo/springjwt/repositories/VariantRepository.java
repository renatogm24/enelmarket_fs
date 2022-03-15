package com.codingdojo.springjwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.codingdojo.springjwt.models.Variant;

public interface VariantRepository extends JpaRepository<Variant,Long> {

	@Transactional
	void deleteByProducto_Id(Long id);
	
}
