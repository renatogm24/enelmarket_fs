package com.codingdojo.springjwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codingdojo.springjwt.models.Role;
import com.codingdojo.springjwt.models.User;

public interface RoleRepository extends JpaRepository<Role, Long> {
	Role findByName(String name);
}
