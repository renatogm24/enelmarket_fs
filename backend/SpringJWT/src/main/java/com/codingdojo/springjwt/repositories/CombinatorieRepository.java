package com.codingdojo.springjwt.repositories;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codingdojo.springjwt.models.Combinatorie;

public interface CombinatorieRepository extends JpaRepository<Combinatorie,Long> {
	@Transactional
	void deleteByProducto_Id(Long id);
}
