package com.ecobazaar.ecobazaar.controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ecobazaar.ecobazaar.model.Product;
import com.ecobazaar.ecobazaar.model.User;
import com.ecobazaar.ecobazaar.repository.UserRepository;
import com.ecobazaar.ecobazaar.service.FileStorageService;
import com.ecobazaar.ecobazaar.service.ProductService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public ProductController(ProductService productService,
                             UserRepository userRepository,
                             FileStorageService fileStorageService) {
        this.productService = productService;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @PreAuthorize("hasAnyAuthority('ROLE_SELLER','ROLE_ADMIN')")
    @PostMapping(consumes = {"multipart/form-data"})
    public Product addProduct(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("details") String details,
            @RequestParam("price") Double price,
            @RequestParam("carbonImpact") Double carbonImpact,
            @RequestParam("category") String category
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("addProduct() auth name = " + auth.getName());
        System.out.println("addProduct() authorities = " + auth.getAuthorities());

        String email = auth.getName();
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        String imageUrl = fileStorageService.save(file);

        Product product = new Product();
        product.setName(name);
        product.setDetails(details);
        product.setPrice(price);
        product.setCarbonImpact(carbonImpact);
        product.setImageUrl(imageUrl);
        product.setCategory(category);
        product.setSeller(seller);

        return productService.createProduct(product);
    }

    // public marketplace -> show ALL products (including non-certified)
    @GetMapping
    public List<Product> listAllProducts() {
        return productService.getAllProducts();
    }

    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    @GetMapping("/seller")
    public List<Product> listSellerProducts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("listSellerProducts() auth name = " + auth.getName());
        System.out.println("listSellerProducts() authorities = " + auth.getAuthorities());

        String email = auth.getName();
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        return productService.getProductsBySellerId(seller.getId());
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    @PutMapping("/{id}")
    public Product updateProductDetails(@PathVariable Long id,
                                        @RequestBody Product incoming,
                                        Authentication auth) {
        String email = auth.getName();
        User current = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product existing = productService.getProductById(id);

        boolean isAdmin = current.getRole() != null && current.getRole().toUpperCase().contains("ADMIN");
        if (!isAdmin) {
            if (existing.getSeller() == null || existing.getSeller().getId() != current.getId()) {
                throw new org.springframework.security.access.AccessDeniedException("You are not the owner of this product");
            }
        }

        existing.setName(incoming.getName());
        existing.setDetails(incoming.getDetails());
        existing.setPrice(incoming.getPrice());
        existing.setCarbonImpact(incoming.getCarbonImpact());
        existing.setImageUrl(incoming.getImageUrl());
        existing.setEcoRequested(
                incoming.getEcoRequested() == null
                        ? existing.isEcoRequested()
                        : incoming.getEcoRequested()
        );

        return productService.saveProduct(existing);
    }

    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteProductDetails(@PathVariable Long id) {
        productService.deleteProductDetails(id);
    }
}
