package com.codingdojo.springjwt.services;

import com.codingdojo.springjwt.models.OptionVar;

public interface OptionService {

	OptionVar saveOption(OptionVar option);
	void deleteOptionsByVariant(Long id);
	
}
