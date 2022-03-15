package com.codingdojo.springjwt.api;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

import javax.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.codingdojo.springjwt.models.Category;
import com.codingdojo.springjwt.models.Combinatorie;
import com.codingdojo.springjwt.models.Image;
import com.codingdojo.springjwt.models.OptionVar;
import com.codingdojo.springjwt.models.Producto;
import com.codingdojo.springjwt.models.Store;
import com.codingdojo.springjwt.models.User;
import com.codingdojo.springjwt.models.Variant;
import com.codingdojo.springjwt.repositories.ImageRepository;
import com.codingdojo.springjwt.services.AmazonS3ImageService;
import com.codingdojo.springjwt.services.CategoryService;
import com.codingdojo.springjwt.services.CombinatorieService;
import com.codingdojo.springjwt.services.OptionService;
import com.codingdojo.springjwt.services.ProductoService;
import com.codingdojo.springjwt.services.StoreService;
import com.codingdojo.springjwt.services.UserService;
import com.codingdojo.springjwt.services.VariantService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductoResource {
	
	private final CategoryService categoryService;
	private final UserService userService;
	private final ProductoService productoService;
	private final VariantService variantService;
	private final OptionService optionService;
	private final CombinatorieService combinatorieService;
	private final AmazonS3ImageService amazonS3ImageService;
	private final ImageRepository imageRepository;
	
	@PostMapping(value="/productos/addProducto",consumes = { MediaType.MULTIPART_MIXED_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE,  MediaType.APPLICATION_OCTET_STREAM_VALUE, MediaType.APPLICATION_JSON_VALUE })
	public ResponseEntity<Producto> addProduct(@RequestPart(name="image", required = false) MultipartFile fotosrc, @Valid @RequestPart(name="producto", required = false) Producto producto ){	
	
		
		if (producto.getId() != null){
			Producto productFound = productoService.findById(producto.getId());
			
			//List<Category> auxList = productFound.getCategories();
			
			for (Category cat : new HashSet<Category>(productFound.getCategories())) {
				productFound.deleteCategory(cat);
			}
				
			for (Variant var : productFound.getVariants()) {
				optionService.deleteOptionsByVariant(var.getId());
			}
			
			//variantService.deleteVariantsByProduct(productFound.getId());
			for (Variant var : new HashSet<Variant>(productFound.getVariants())) {
				productFound.deleteVariant(var);
				variantService.deleteVariantsById(var.getId());
			}
			
			combinatorieService.deleteByProducto(productFound.getId());
		} 
		
		List<Category> categoriesNew = new ArrayList<Category>();
		producto.getCategoriesForm().forEach(cat ->{
			Category newCat = categoryService.findById(Long.parseLong(cat));
			categoriesNew.add(newCat);
		});
		
		producto.setCategories(categoriesNew);
		
		Producto newProduct = productoService.saveProducto(producto);
		
		for (int i = 0; i < producto.getVariantsForm().size(); i++) {		
			Variant newVariant = variantService.saveVariant(new Variant(null, producto.getVariantsForm().get(i), newProduct, null));
			for (int j = 0; j < producto.getVariantsOptions().get(i).size(); j++) {				
				optionService.saveOption(new OptionVar(null, producto.getVariantsOptions().get(i).get(j), newVariant));
			}
		}
		
		producto.getVariantsCombinatories().forEach(combinatorie ->{
			combinatorieService.saveCombinatorie(new Combinatorie(null, combinatorie.get(0), Double.valueOf(combinatorie.get(1)), newProduct));
		});
		
		if (fotosrc != null) {
			imageRepository.deleteByProducto_Id(newProduct.getId());
			Image newImage = amazonS3ImageService.insertImage(fotosrc);
			newImage.setProducto(newProduct);
			imageRepository.save(newImage);
		}
		
		return ResponseEntity.ok().body(newProduct);
	}
	
	@GetMapping("/productos/all")
	public ResponseEntity<List<Producto>> getUserSession(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		User user = userService.getUser(currentPrincipalName);
		 
		List<Long> listIds = new ArrayList<>();
		List<Producto> listProducts = new ArrayList<>();
		
		List<Category> listCategories = user.getStore().getCategories();
		
		for (Category category : listCategories) {
			for (Producto producto : category.getProductos()) {
				if(!listIds.contains(producto.getId())) {
					listIds.add(producto.getId());
					listProducts.add(producto);
				}
			}
		}
		
		return ResponseEntity.ok().body(listProducts);
	}
	
	
	@GetMapping("/productos/deleteProducto")
	public ResponseEntity<String> deleteProduct(@RequestParam String id){
		
		Long auxId = Long.parseLong(id);
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String currentPrincipalName = authentication.getName();
		User user = userService.getUser(currentPrincipalName);
		
		String result = "error";
		
		Producto productoFound = productoService.findById(auxId);
		if(productoFound.getCategories().get(0).getStore() == user.getStore()) {
			productoService.deleteById(auxId);
			result = "Ok";
		}		
		
		return ResponseEntity.ok().body(result);
	}
	
}
