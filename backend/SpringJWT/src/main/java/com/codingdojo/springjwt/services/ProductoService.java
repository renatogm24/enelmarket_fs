package com.codingdojo.springjwt.services;

import com.codingdojo.springjwt.models.Producto;

public interface ProductoService {
	Producto saveProducto(Producto producto);
	Producto findById(Long id);
	void deleteById(Long id);
}
