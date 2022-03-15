package com.codingdojo.springjwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codingdojo.springjwt.models.Ordercart;

public interface OrdercartRepository extends JpaRepository<Ordercart,Long> {

	
	
}
