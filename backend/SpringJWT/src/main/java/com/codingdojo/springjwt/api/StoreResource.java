package com.codingdojo.springjwt.api;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codingdojo.springjwt.models.Store;
import com.codingdojo.springjwt.services.StoreService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StoreResource {

	
private final StoreService storeService;
	
@GetMapping("/stores")
public ResponseEntity<List<Store>> getStores(){	
	List<Store> listStores = storeService.getAllStores();
	return ResponseEntity.ok().body(listStores);
}
	
@GetMapping("/store")
public ResponseEntity<Store> getStore(@RequestParam(value="name") String name){
	log.info(name);
	Store aux = storeService.findByName(name);
	return ResponseEntity.ok().body(aux);
}

@GetMapping("/store2/getCobrosEnvios")
public ResponseEntity<?> getCobrosEnvios(@RequestParam(value="name") String name){
	log.info(name);
	Store aux = storeService.findByName(name);
	Object[] arr = new Object[2];
	arr[0] = aux.getCobros();
	arr[1] = aux.getEnvios();
	return ResponseEntity.ok().body(arr);
}
	
	@GetMapping("/isNameValid")
	public ResponseEntity<String> getUsers(@RequestParam(value="name") String name){
		log.info(name);
		boolean aux = storeService.existsByName(name);
		log.info(String.valueOf(aux));
		return ResponseEntity.ok().body(String.valueOf(aux));
	}
}
