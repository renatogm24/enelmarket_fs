package com.codingdojo.springjwt.repositories;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codingdojo.springjwt.models.Image;

public interface ImageRepository extends JpaRepository<Image,Long>{
	@Transactional
	void deleteByProducto_Id(Long id);
}
