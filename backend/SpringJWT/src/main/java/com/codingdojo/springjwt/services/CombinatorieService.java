package com.codingdojo.springjwt.services;

import com.codingdojo.springjwt.models.Combinatorie;

public interface CombinatorieService {

	Combinatorie saveCombinatorie(Combinatorie combinatorie);
	void deleteByProducto(Long id);
}
