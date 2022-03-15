package com.codingdojo.springjwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codingdojo.springjwt.models.Envio;

public interface EnvioRepository extends JpaRepository<Envio,Long> {

}
