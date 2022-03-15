package com.codingdojo.springjwt.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingdojo.springjwt.models.Store;
import com.codingdojo.springjwt.repositories.StoreRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class StoreServiceImpl implements StoreService {

	private final StoreRepository storeRepo;
	
	@Override
	public boolean existsByName(String name) {
		if (storeRepo.findByName(name)==null) {
			return false;
		} else {
			return true;
		}
	}

	@Override
	public Store saveStore(Store store) {
		return storeRepo.save(store);
	}

	@Override
	public List<Store> getAllStores() {		
		return storeRepo.findAll();
	}

	@Override
	public Store findByName(String name) {
		return storeRepo.findByName(name);
	}
	
	
	
}
