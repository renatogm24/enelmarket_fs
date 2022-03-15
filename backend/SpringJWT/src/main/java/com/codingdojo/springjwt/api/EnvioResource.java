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

import com.codingdojo.springjwt.models.Cobro;
import com.codingdojo.springjwt.models.Envio;
import com.codingdojo.springjwt.models.Store;
import com.codingdojo.springjwt.models.User;
import com.codingdojo.springjwt.services.CobroService;
import com.codingdojo.springjwt.services.EnvioService;
import com.codingdojo.springjwt.services.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EnvioResource {

	private final EnvioService envioService;
	private final UserService userService;
	
	@PostMapping("/envios/addEnvio")
	public ResponseEntity<Envio> addEnvio(@Valid @RequestBody Envio envio){	
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		User user = userService.getUser(currentPrincipalName);
		Store storeAux = user.getStore();
		
		envio.setStoreEnvio(storeAux);
		Envio newEnvio = envioService.saveEnvio(envio);
		
		return ResponseEntity.ok().body(newEnvio);
	}
	
	
	@GetMapping("/envios/deleteEnvio")
	public ResponseEntity<String> deleteEnvio(@RequestParam String id){
		
		Long auxId = Long.parseLong(id);
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		User user = userService.getUser(currentPrincipalName);
		
		String result = "error";
		
		Envio envioFound = envioService.findById(auxId);
		
		if(envioFound.getStoreEnvio() == user.getStore()) {
			envioService.deleteById(auxId);
			result = "Ok";
		}		
		
		return ResponseEntity.ok().body(result);
	}
	
}