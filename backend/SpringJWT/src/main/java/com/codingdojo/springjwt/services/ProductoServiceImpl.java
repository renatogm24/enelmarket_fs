package com.codingdojo.springjwt.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingdojo.springjwt.models.Producto;
import com.codingdojo.springjwt.repositories.ProductoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductoServiceImpl implements ProductoService {

	private final ProductoRepository productoRepository;
	
	@Override
	public Producto saveProducto(Producto producto) {
		return productoRepository.save(producto);
	}

	@Override
	public Producto findById(Long id) {
		// TODO Auto-generated method stub
		return productoRepository.findById(id).get();
	}

	@Override
	public void deleteById(Long id) {
		// TODO Auto-generated method stub
		productoRepository.deleteById(id);
	}

	
	
}
