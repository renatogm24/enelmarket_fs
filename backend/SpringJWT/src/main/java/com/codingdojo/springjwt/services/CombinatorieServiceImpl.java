package com.codingdojo.springjwt.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingdojo.springjwt.models.Combinatorie;
import com.codingdojo.springjwt.repositories.CategoryRepository;
import com.codingdojo.springjwt.repositories.CombinatorieRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CombinatorieServiceImpl implements CombinatorieService {

	private final CombinatorieRepository combinatorieRepository;
	
	@Override
	public Combinatorie saveCombinatorie(Combinatorie combinatorie) {
		return combinatorieRepository.save(combinatorie);
	}

	@Override
	public void deleteByProducto(Long id) {
		combinatorieRepository.deleteByProducto_Id(id);
	}

}
