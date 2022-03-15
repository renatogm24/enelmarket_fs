package com.codingdojo.springjwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codingdojo.springjwt.models.Producto;

public interface ProductoRepository extends JpaRepository<Producto,Long> {

}
