package com.codingdojo.springjwt.validators;

import org.springframework.beans.factory.annotation.Autowired;

import com.codingdojo.springjwt.services.UserService;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UserUniqueValidator implements ConstraintValidator<Unique,String>{
	
	@Autowired
    private UserService userService;

    @Override
    public void initialize(Unique unique) {
        unique.message();
    }

    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        if (userService != null && userService.existsByUsername(username)) {
            return false;
        }
        return true;
    }

}
