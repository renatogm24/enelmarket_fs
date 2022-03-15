package com.codingdojo.springjwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codingdojo.springjwt.models.Cobro;

public interface CobroRepository extends JpaRepository<Cobro,Long> {

}
