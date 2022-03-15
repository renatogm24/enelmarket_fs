package com.codingdojo.springjwt.services;

import com.codingdojo.springjwt.models.Ordercart;

public interface OrdercartService {

	Ordercart saveOrdercart(Ordercart odercart);
	Ordercart findOrdercart(Long id);
	
}
