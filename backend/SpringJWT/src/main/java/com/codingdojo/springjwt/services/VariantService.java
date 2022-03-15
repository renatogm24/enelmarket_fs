package com.codingdojo.springjwt.services;

import com.codingdojo.springjwt.models.Variant;

public interface VariantService {
	Variant saveVariant(Variant variant);
	void deleteVariantsByProduct(Long id);
	void deleteVariantsById(Long id);
}
