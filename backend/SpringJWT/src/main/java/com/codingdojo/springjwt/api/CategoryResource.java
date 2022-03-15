package com.codingdojo.springjwt.api;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.codingdojo.springjwt.models.Category;
import com.codingdojo.springjwt.models.Store;
import com.codingdojo.springjwt.models.User;
import com.codingdojo.springjwt.services.CategoryService;
import com.codingdojo.springjwt.services.StoreService;
import com.codingdojo.springjwt.services.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CategoryResource {

	private final CategoryService categoryService;
	private final UserService userService;
	private final StoreService storeService;
	
	@GetMapping("/categories")
	public ResponseEntity<List<Category>> getCategories(){	
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		User user = userService.getUser(currentPrincipalName);
		
		log.info(String.valueOf(user.getStore().getId()));
		List<Category> listCategories = categoryService.getAllStoresByStore_Id(user.getStore().getId());
		return ResponseEntity.ok().body(listCategories);
	}
	
	@GetMapping("/category")
	public ResponseEntity<Category> getCategoryByStoreByOrder(@RequestParam(value="name") String name, @RequestParam(value="order") Integer order){
		Store aux = storeService.findByName(name);
		Category catAux = aux.getCategories().stream().filter(cat -> order.equals(cat.getOrderCat())).findFirst().orElse(null);
		return ResponseEntity.ok().body(catAux);
	}
	
	@GetMapping("/categoriesStore")
	public ResponseEntity<List<Category>> getcategoriesStore(@RequestParam(value="name") String name){
		log.info(name);
		Store aux = storeService.findByName(name);
		return ResponseEntity.ok().body(aux.getCategories());
	}
	
	@PostMapping("/categories/addCategory")
	public ResponseEntity<Category> addCategory(@Valid @RequestBody Category category){	
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		User user = userService.getUser(currentPrincipalName);
		
		List<Category> listCategories = categoryService.getAllStoresByStore_Id(user.getStore().getId());
		
		category.setOrderCat(listCategories.size()+1);
		Store storeAux = user.getStore();
		category.setStore(storeAux);
		categoryService.saveCategory(category);
		//storeAux.getCategories().add(category);		
		//storeService.saveStore(storeAux);
		return ResponseEntity.ok().body(category);
	}
	
	@PostMapping("/categories/updateCategories")
	public ResponseEntity<String> addCategories(@RequestBody List<List<String>> categories){	
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		User user = userService.getUser(currentPrincipalName);
		
		List<Category> listCategories = categoryService.getAllStoresByStore_Id(user.getStore().getId());
		
		for (Category categoryOld : listCategories) {
			
			boolean found = false;
			
			for (List<String> categoryNew : categories) {
				
				if(categoryOld.getId().equals(Long.parseLong( categoryNew.get(0)) )) {
					found = true;
					if(categoryOld.getOrderCat() != Integer.parseInt(categoryNew.get(1))) {
						categoryOld.setOrderCat(Integer.parseInt(categoryNew.get(1)));
						categoryService.saveCategory(categoryOld);
					}
				}			
			}
			
			if(!found) {
				categoryService.deleteCategory(categoryOld);
				//recordar que cuando tenga productos se debera borrar todos sus productos tmb
			}
			
		}
		
		
		return ResponseEntity.ok().body(categories.get(0).get(0));
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
	
}
