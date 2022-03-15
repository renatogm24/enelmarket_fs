package com.codingdojo.springjwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codingdojo.springjwt.models.Store;

public interface StoreRepository extends JpaRepository<Store,Long> {
	Store findByName(String name);
}
