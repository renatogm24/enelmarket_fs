package com.codingdojo.springjwt.api;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codingdojo.springjwt.models.Envio;
import com.codingdojo.springjwt.models.Ordercart;
import com.codingdojo.springjwt.models.Store;
import com.codingdojo.springjwt.models.User;
import com.codingdojo.springjwt.services.EnvioService;
import com.codingdojo.springjwt.services.OrdercartService;
import com.codingdojo.springjwt.services.ProductOrderService;
import com.codingdojo.springjwt.services.StoreService;
import com.codingdojo.springjwt.services.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrdercartResource {

	private final OrdercartService ordercartService;
	private final ProductOrderService productOrderService;
	private final StoreService storeService;
	private final UserService userService;
	
	@PostMapping("/ordenes/addOrden")
	public ResponseEntity<Ordercart> addEnvio(@Valid @RequestBody Ordercart ordercart){	
	
		Store store = storeService.findByName(ordercart.getStoreName());
		
		ordercart.setStore(store);
		
		Ordercart newOrder = ordercartService.saveOrdercart(ordercart);
		ordercart.getProductos().forEach(item ->{
			item.setOrdercart(newOrder);
			productOrderService.saveProductOrder(item);
		});
		
		
		return ResponseEntity.ok().body(newOrder);
	}
	
	@PostMapping("/ordenes/updateOrden")
	public ResponseEntity<Ordercart> updateEnvio(@Valid @RequestBody Ordercart ordercart){	
	
		
		System.out.println(ordercart);
		
		Ordercart orderFound = ordercartService.findOrdercart(ordercart.getId());
		
		orderFound.setNamePay(ordercart.getNamePay());
		orderFound.setLastnamePay(ordercart.getLastnamePay());
		orderFound.setPhonePay(ordercart.getPhonePay());
		orderFound.setPagoCodigo(ordercart.getPagoCodigo());
		
		ordercartService.saveOrdercart(orderFound);
		
		return ResponseEntity.ok().body(orderFound);
	}
	
	
	@GetMapping("/orders/updateOrder")
	public ResponseEntity<String> updateEnvioEstado(@RequestParam String id, @RequestParam String estado){	
	
		Long auxId = Long.parseLong(id);
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		User user = userService.getUser(currentPrincipalName);
		
		String result = "error";
		
		Ordercart orderFound = ordercartService.findOrdercart(auxId);
		
		if (orderFound.getStore() == user.getStore()) {
			orderFound.setEstado(estado);
			ordercartService.saveOrdercart(orderFound);
			result = "ok";
		}
		
		return ResponseEntity.ok().body(result);
	}
	
}
