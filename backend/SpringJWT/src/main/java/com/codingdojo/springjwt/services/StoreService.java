package com.codingdojo.springjwt.services;

import java.util.List;

import com.codingdojo.springjwt.models.Store;

public interface StoreService {
	Store saveStore(Store store);
	boolean existsByName(String name);
	List<Store> getAllStores();
	Store findByName(String name);
}
