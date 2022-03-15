package com.codingdojo.springjwt.api;

import java.util.List;

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

import com.codingdojo.springjwt.models.Category;
import com.codingdojo.springjwt.models.Cobro;
import com.codingdojo.springjwt.models.Producto;
import com.codingdojo.springjwt.models.Store;
import com.codingdojo.springjwt.models.User;
import com.codingdojo.springjwt.services.CategoryService;
import com.codingdojo.springjwt.services.CobroService;
import com.codingdojo.springjwt.services.StoreService;
import com.codingdojo.springjwt.services.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CobroResource {

	private final CobroService cobroService;
	private final UserService userService;
	
	@PostMapping("/cobros/addCobro")
	public ResponseEntity<Cobro> addCobro(@Valid @RequestBody Cobro cobro){	
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		User user = userService.getUser(currentPrincipalName);
		Store storeAux = user.getStore();
		
		cobro.setStoreCobro(storeAux);
		Cobro newCobro = cobroService.saveCobro(cobro);
		
		return ResponseEntity.ok().body(newCobro);
	}
	
	@GetMapping("/cobros/deleteCobro")
	public ResponseEntity<String> deleteProduct(@RequestParam String id){
		
		Long auxId = Long.parseLong(id);
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		User user = userService.getUser(currentPrincipalName);
		
		String result = "error";
		
		Cobro cobroFound = cobroService.findById(auxId);
		if(cobroFound.getStoreCobro() == user.getStore()) {
			cobroService.deleteCobroById(auxId);
			result = "Ok";
		}		
		
		return ResponseEntity.ok().body(result);
	}
	
}
