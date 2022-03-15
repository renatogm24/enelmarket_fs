package com.codingdojo.springjwt.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingdojo.springjwt.models.Envio;
import com.codingdojo.springjwt.repositories.EnvioRepository;
import com.codingdojo.springjwt.repositories.OptionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class EnvioServiceImpl implements EnvioService {

	private final EnvioRepository envioRepository;
	
	@Override
	public Envio saveEnvio(Envio envio) {
		return envioRepository.save(envio);
	}

	@Override
	public Envio findById(Long id) {
		return envioRepository.findById(id).get();
	}

	@Override
	public void deleteById(Long id) {
		envioRepository.deleteById(id);
	}

	
	
}
