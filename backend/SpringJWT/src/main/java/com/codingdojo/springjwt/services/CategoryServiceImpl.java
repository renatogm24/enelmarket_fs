package com.codingdojo.springjwt.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingdojo.springjwt.models.Category;
import com.codingdojo.springjwt.repositories.CategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CategoryServiceImpl implements CategoryService {

	private final CategoryRepository categoryRepository;
	
	@Override
	public Category saveCategory(Category category) {
		return categoryRepository.save(category);
	}

	@Override
	public Category findByName(String name) {
		return categoryRepository.findByName(name);
	}

	@Override
	public List<Category> getAllStoresByStore_Id(Long id) {
		// TODO Auto-generated method stub
		return categoryRepository.findByStore_IdOrderByOrderCat(id);
	}

	@Override
	public boolean existsByName(String name) {
		if (categoryRepository.findByName(name)==null) {
			return false;
		} else {
			return true;
		}
	}

	@Override
	public void deleteCategory(Category category) {
		categoryRepository.delete(category);
	}

	@Override
	public Category findById(Long id) {
		return categoryRepository.findById(id).get();
	}

}
