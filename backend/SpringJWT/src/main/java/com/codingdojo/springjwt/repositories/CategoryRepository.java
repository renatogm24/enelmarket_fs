package com.codingdojo.springjwt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codingdojo.springjwt.models.Category;

public interface CategoryRepository extends JpaRepository<Category,Long> {
	Category findByName(String name);
	
	List<Category> findByStore_IdOrderByOrderCat(Long id);
}
