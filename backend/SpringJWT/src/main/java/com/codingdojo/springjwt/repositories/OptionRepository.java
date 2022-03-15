package com.codingdojo.springjwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.codingdojo.springjwt.models.OptionVar;

public interface OptionRepository extends JpaRepository<OptionVar,Long> {
	@Transactional
	void deleteByVariant_Id(Long id);
}
