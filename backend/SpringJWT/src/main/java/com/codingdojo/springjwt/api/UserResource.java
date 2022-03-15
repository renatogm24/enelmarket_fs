package com.codingdojo.springjwt.api;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.codingdojo.springjwt.models.Category;
import com.codingdojo.springjwt.models.Image;
import com.codingdojo.springjwt.models.Role;
import com.codingdojo.springjwt.models.Store;
import com.codingdojo.springjwt.models.User;
import com.codingdojo.springjwt.repositories.CategoryRepository;
import com.codingdojo.springjwt.repositories.ImageRepository;
import com.codingdojo.springjwt.services.AmazonS3ImageService;
import com.codingdojo.springjwt.services.StoreService;
import com.codingdojo.springjwt.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.validation.FieldError;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserResource {

	private final UserService userService;
	private final StoreService storeService;
	private final AmazonS3ImageService amazonS3ImageService;
	private final ImageRepository imageRepository;
	private final CategoryRepository categoryRepository;
	
	@GetMapping("/users")
	public ResponseEntity<List<User>> getUsers(){
		return ResponseEntity.ok().body(userService.getUsers());
	}
	
	@GetMapping("/user/session")
	public ResponseEntity<User> getUserSession(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		User user = userService.getUser(currentPrincipalName);
		return ResponseEntity.ok().body(user);
	}
	
	@PostMapping("/user/save")
	public ResponseEntity<User> saveUser(@Valid @RequestBody User user){
		//return ResponseEntity.ok().body(userService.saveUser(user));
		//if (result.hasErrors()) {
		//	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error");
		//}
		
		User newUser = userService.saveUser(user);
		userService.addRoleToUser(newUser.getUsername(), "ROLE_USER");
		
		Store newStore = storeService.saveStore(new Store(null,newUser.getStoreName(), newUser, null, null, new ArrayList<Category>(),null,null,null));
		
		Category newCategory = new Category(null,"Categoria 1",1,newStore,null);
		categoryRepository.save(newCategory);		
		
		URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/user/save").toUriString());
		return ResponseEntity.created(uri).body(newUser);
		//return ResponseEntity.ok("User is valid");
	}
	
	@PostMapping(path="/user/changePictures",consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<String> changePictures(@RequestPart(name="portada", required = false) MultipartFile portada, @RequestPart(name="logo", required = false) MultipartFile logo){		
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		User user = userService.getUser(currentPrincipalName);
		
		if (logo != null) {
			Image newImage = amazonS3ImageService.insertImage(logo);
			
			
			if (user.getStore().getLogo_img() == null) {
				newImage.setStore_owner_logo(user.getStore());
				imageRepository.save(newImage);
			} else {
				Image oldImage = user.getStore().getLogo_img();
				oldImage.setUrl(newImage.getUrl());
				imageRepository.save(oldImage);
			}
			
			
			//user.setLogo_img(newImage);
			//userService.saveUser(user);
		}
		
		if (portada != null) {
			Image newImage = amazonS3ImageService.insertImage(portada);
			
			if (user.getStore().getPortada_img() == null) {
				newImage.setStore_owner_portada(user.getStore());
				imageRepository.save(newImage);
			} else {
				Image oldImage = user.getStore().getPortada_img();
				oldImage.setUrl(newImage.getUrl());
				imageRepository.save(oldImage);
			}
			

			//user.setPortada_img(newImage);
			//userService.saveUser(user);
		}
		
		URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/user/changePictures").toUriString());
		return ResponseEntity.created(uri).body("Ok");
		
	}
	
	@ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
	
	@PostMapping("/role/save")
	public ResponseEntity<Role> saveRole(@RequestBody Role role){
		URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/role/save").toUriString());
		return ResponseEntity.created(uri).body(userService.saveRole(role));
	}
	
	@PostMapping("/role/addtouser")
	public ResponseEntity<?> addRoleToUser(@RequestBody RoleToUserForm form){
		userService.addRoleToUser(form.getUsername(),form.getRoleName());
		return ResponseEntity.ok().build();
	}
	
	@GetMapping("/token/refresh")
	public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException{
		log.info("Token refresh");
		String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		
		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			
			try {
				String refresh_token = authorizationHeader.substring("Bearer ".length());
				Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
				JWTVerifier verifier = JWT.require(algorithm).build();
				DecodedJWT decodedJWT = verifier.verify(refresh_token);
				String username = decodedJWT.getSubject();
				User user = userService.getUser(username);

				String access_token = JWT.create().withSubject(user.getUsername())
						.withExpiresAt(new Date(System.currentTimeMillis() + 60 * 60 * 1000))
						.withIssuer(request.getRequestURL().toString())
						.withClaim("roles",
								user.getRoles().stream().map(Role::getName).collect(Collectors.toList()))
						.sign(algorithm);
				
				Map<String, String> tokens = new HashMap<>();
				tokens.put("access_token", access_token);
				tokens.put("refresh_token", refresh_token);
				response.setContentType(MediaType.APPLICATION_JSON_VALUE);
				new ObjectMapper().writeValue(response.getOutputStream(), tokens);
			} catch (Exception e) {
				response.setHeader("error", e.getMessage());
				response.setStatus(HttpStatus.FORBIDDEN.value());
				//response.sendError(HttpStatus.FORBIDDEN.value());
				Map<String, String> errors = new HashMap<>();
				errors.put("error_message", e.getMessage());
				response.setContentType(MediaType.APPLICATION_JSON_VALUE);
				new ObjectMapper().writeValue(response.getOutputStream(), errors);
			}
			
			
		}else {
			throw new RuntimeException("Refresh token is missing");
		}
	}
	
}

@Data
class RoleToUserForm{
	private String username;
	private String roleName;
}