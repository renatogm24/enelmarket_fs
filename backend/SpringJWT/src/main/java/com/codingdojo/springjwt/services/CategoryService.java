package com.codingdojo.springjwt.services;

import java.util.List;

import com.codingdojo.springjwt.models.Category;

public interface CategoryService {
	Category saveCategory(Category category);
	Category findByName(String name);
	Category findById(Long id);
	List<Category> getAllStoresByStore_Id(Long id);
	boolean existsByName(String name);
	void deleteCategory(Category category);
}
