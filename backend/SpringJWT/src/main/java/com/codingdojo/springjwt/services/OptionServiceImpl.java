package com.codingdojo.springjwt.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingdojo.springjwt.models.OptionVar;
import com.codingdojo.springjwt.repositories.OptionRepository;
import com.codingdojo.springjwt.repositories.ProductoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OptionServiceImpl implements OptionService {
	
	private final OptionRepository optionRepository;
	
	@Override
	public OptionVar saveOption(OptionVar option) {
		return optionRepository.save(option);
	}

	@Override
	public void deleteOptionsByVariant(Long id) {
		optionRepository.deleteByVariant_Id(id);
	}

	
}
