package com.ecobazaar.ecobazaar.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.ecobazaar.ecobazaar.dto.CartSummaryDto;
import com.ecobazaar.ecobazaar.model.CartItem;
import com.ecobazaar.ecobazaar.model.User;
import com.ecobazaar.ecobazaar.repository.UserRepository;
import com.ecobazaar.ecobazaar.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @PostMapping
    public CartItem addToCart(@RequestBody CartItem cartItem) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        cartItem.setUserId(currentUser.getId());
        return cartService.addToCart(cartItem);
    }

    @PreAuthorize("hasAuthority('ROLE_USER')")
    @GetMapping
    public CartSummaryDto getCartSummary() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return cartService.getCartSummary(currentUser.getId());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_SELLER','ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public String removeFromCart(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return "Item removed";
    }


    
    @PreAuthorize("hasAuthority('ROLE_USER')")
    @PostMapping("/checkout")
    public Map<String, String> checkout() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        cartService.clearCart(currentUser.getId());

        return Map.of("message", "Checkout successful");
    }



}