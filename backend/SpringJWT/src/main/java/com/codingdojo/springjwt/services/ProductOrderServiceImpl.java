package com.codingdojo.springjwt.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingdojo.springjwt.models.ProductOrder;
import com.codingdojo.springjwt.repositories.CobroRepository;
import com.codingdojo.springjwt.repositories.ProductOrderRepository;
import com.codingdojo.springjwt.repositories.ProductoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductOrderServiceImpl implements ProductOrderService {

	private final ProductOrderRepository productOrderRepository;
	
	@Override
	public ProductOrder saveProductOrder(ProductOrder productOrder) {
		return productOrderRepository.save(productOrder);
	}

	@Override
	public ProductOrder findProductOrder(Long id) {
		return productOrderRepository.findById(id).get();
	}

}
