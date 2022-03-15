package com.codingdojo.springjwt.services;

import com.codingdojo.springjwt.models.ProductOrder;

public interface ProductOrderService {

	ProductOrder saveProductOrder(ProductOrder productOrder);
	ProductOrder findProductOrder(Long id);
	
}
