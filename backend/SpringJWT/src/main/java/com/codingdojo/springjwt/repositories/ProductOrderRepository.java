package com.codingdojo.springjwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codingdojo.springjwt.models.ProductOrder;

public interface ProductOrderRepository extends JpaRepository<ProductOrder,Long> {

}
