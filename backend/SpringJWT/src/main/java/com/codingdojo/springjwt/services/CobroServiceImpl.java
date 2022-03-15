package com.codingdojo.springjwt.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingdojo.springjwt.models.Cobro;
import com.codingdojo.springjwt.repositories.CobroRepository;
import com.codingdojo.springjwt.repositories.OptionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CobroServiceImpl implements CobroService {

	private final CobroRepository cobroRepository;
	
	@Override
	public Cobro saveCobro(Cobro cobro) {
		return cobroRepository.save(cobro);
	}

	@Override
	public Cobro findById(Long id) {
		return cobroRepository.findById(id).get();
	}

	@Override
	public void deleteCobroById(Long id) {
		cobroRepository.deleteById(id);
	}

	
	
}
