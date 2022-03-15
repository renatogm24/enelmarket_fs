package com.codingdojo.springjwt.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingdojo.springjwt.models.Ordercart;
import com.codingdojo.springjwt.repositories.EnvioRepository;
import com.codingdojo.springjwt.repositories.OrdercartRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrdercartServiceImpl implements OrdercartService {
	
	private final OrdercartRepository ordercartRepository;

	@Override
	public Ordercart saveOrdercart(Ordercart odercart) {
		return ordercartRepository.save(odercart);
	}

	@Override
	public Ordercart findOrdercart(Long id) {
		return ordercartRepository.findById(id).get();
	}
	
	

}
