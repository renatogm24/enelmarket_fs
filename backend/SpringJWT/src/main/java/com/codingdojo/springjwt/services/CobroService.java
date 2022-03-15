package com.codingdojo.springjwt.services;

import com.codingdojo.springjwt.models.Cobro;

public interface CobroService {

	Cobro saveCobro(Cobro cobro);
	Cobro findById(Long id);
	void deleteCobroById(Long id);
}
