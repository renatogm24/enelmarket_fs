package com.codingdojo.springjwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codingdojo.springjwt.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
	User findByUsername(String username);
}
