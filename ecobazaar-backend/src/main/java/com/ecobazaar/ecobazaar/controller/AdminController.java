package com.ecobazaar.ecobazaar.controller;

import java.util.List;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.ecobazaar.ecobazaar.model.Product;
import com.ecobazaar.ecobazaar.model.User;
import com.ecobazaar.ecobazaar.service.AdminService;
import com.ecobazaar.ecobazaar.service.ProductService;

@RestController

@RequestMapping("/api/admin")

public class AdminController {


private final AdminService adminService;
private final ProductService productService;

public AdminController(AdminService adminService, ProductService productService) {
    this.adminService = adminService;
    this.productService = productService;
}

@PreAuthorize("hasAuthority('ROLE_ADMIN')")

@PutMapping("/approveProduct/{id}")

public Product approveProduct(@PathVariable Long id) {

return adminService.approveProduct(id);

}


@PreAuthorize("hasAuthority('ROLE_ADMIN')")

@PutMapping("/approveSeller/{id}")

public User approveSeller(@PathVariable Long id) {

return adminService.approveSeller(id);

}


@PreAuthorize("hasAuthority('ROLE_ADMIN')")

@GetMapping("/users")

public List<User> getAllUsers() {

return adminService.getAllUsers();

}


@PreAuthorize("hasAuthority('ROLE_ADMIN')")

@GetMapping("/reports")

public Map<String, Object> getReports() {

return adminService.getAdminReport();

}


@PreAuthorize("hasAuthority('ROLE_ADMIN')")

@GetMapping("/reports/download")

public String downloadReport() {

return adminService.generateReportCSV();

}
@PreAuthorize("hasAuthority('ROLE_ADMIN')") 
@GetMapping("/products")
public List<Product> getAllProductsForAdmin() {
    // This reuses the service method that returns the list
    return productService.getAllProducts();
}

}