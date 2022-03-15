package com.codingdojo.springjwt.services;

import java.util.List;

import com.codingdojo.springjwt.models.Role;
import com.codingdojo.springjwt.models.User;

public interface UserService {
	User saveUser(User user);
	Role saveRole(Role role);
	void addRoleToUser(String username, String roleName);
	User getUser(String username);
	List<User> getUsers();
	boolean existsByUsername(String username);
}
