package com.codingdojo.springjwt.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingdojo.springjwt.models.Variant;
import com.codingdojo.springjwt.repositories.VariantRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class VariantServiceImpl implements VariantService {
	
	private final VariantRepository variantRepository;
	
	@Override
	public Variant saveVariant(Variant variant) {
		return variantRepository.save(variant);
	}

	@Override
	public void deleteVariantsByProduct(Long id) {
		variantRepository.deleteByProducto_Id(id);
	}

	@Override
	public void deleteVariantsById(Long id) {
		variantRepository.deleteById(id);
	}

}
