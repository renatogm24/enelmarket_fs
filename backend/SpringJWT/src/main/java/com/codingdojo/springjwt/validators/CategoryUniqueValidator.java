package com.codingdojo.springjwt.validators;

import org.springframework.beans.factory.annotation.Autowired;

import com.codingdojo.springjwt.services.CategoryService;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class CategoryUniqueValidator implements ConstraintValidator<UniqueCategory,String>{
	
	@Autowired
    private CategoryService categoryService;

    @Override
    public void initialize(UniqueCategory uniqueCategory) {
    	uniqueCategory.message();
    }

    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        if (categoryService != null && categoryService.existsByName(username)) {
            return false;
        }
        return true;
    }

}
