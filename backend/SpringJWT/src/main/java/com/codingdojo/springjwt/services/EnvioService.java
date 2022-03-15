package com.codingdojo.springjwt.services;

import com.codingdojo.springjwt.models.Envio;

public interface EnvioService {

	Envio saveEnvio(Envio envio);
	Envio findById(Long id);
	void deleteById(Long id);
}
