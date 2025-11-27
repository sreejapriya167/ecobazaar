package com.ecobazaar.ecobazaar.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ecobazaar.ecobazaar.dto.CartSummaryDto;
import com.ecobazaar.ecobazaar.model.CartItem;
import com.ecobazaar.ecobazaar.model.Product;
import com.ecobazaar.ecobazaar.repository.CartRepository;
import com.ecobazaar.ecobazaar.repository.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public CartItem addToCart(CartItem cartItem) {

        Optional<CartItem> existingOpt =
            cartRepository.findByUserIdAndProductId(cartItem.getUserId(), cartItem.getProductId());

        if (existingOpt.isPresent()) {
            CartItem existing = existingOpt.get();
            existing.setQuantity(existing.getQuantity() + cartItem.getQuantity());
            return cartRepository.save(existing);
        } else {
            return cartRepository.save(cartItem);
        }
    }


    public CartSummaryDto getCartSummary(Long userId) {

        List<CartItem> cartItems = cartRepository.findByUserId(userId);

        double totalPrice = 0;
        double totalCarbonUsed = 0;
        double totalCarbonSaved = 0;
        String ecoSuggestion = null;

        List<CartSummaryDto.Line> lines = new ArrayList<>();

        for (CartItem item : cartItems) {

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));

            double price = product.getPrice() != null ? product.getPrice() : 0.0;
            double carbonImpact = product.getCarbonImpact() != null ? product.getCarbonImpact() : 0.0;

            totalPrice += price * item.getQuantity();
            totalCarbonUsed += carbonImpact * item.getQuantity();

            // add line so frontend can see product + ecoCertified
            lines.add(new CartSummaryDto.Line(item.getId(), item.getQuantity(), product));

            if (!Boolean.TRUE.equals(product.getEcoCertified())) {

                String keyword = product.getName() != null ? product.getName() : "";
                String[] words = keyword.split("\\s+");
                String searchTerm = words.length > 0 ? words[words.length - 1].replaceAll("[^a-zA-Z]", "") : keyword;

                Optional<Product> ecoAlt = productRepository
                        .findFirstByEcoCertifiedTrueAndNameContainingIgnoreCase(searchTerm);

                if (ecoAlt.isPresent()) {
                    double ecoCarbon = ecoAlt.get().getCarbonImpact() != null ? ecoAlt.get().getCarbonImpact() : 0.0;
                    double saved = (carbonImpact - ecoCarbon) * item.getQuantity();

                    if (saved > 0) {
                        totalCarbonSaved += saved;
                        if (ecoSuggestion == null) {
                            ecoSuggestion = "Switch to " + ecoAlt.get().getName()
                                    + " and save " + String.format("%.2f", saved) + " kg CO₂!";
                        }
                    }
                }
            }
        }

        return new CartSummaryDto(
                lines,
                totalPrice,
                totalCarbonUsed,
                totalCarbonSaved,
                ecoSuggestion
        );
    }

    public void removeFromCart(Long id) {
        cartRepository.deleteById(id);
    }
 // In CartService.java
    public void clearCart(Long userId) {
        List<CartItem> items = cartRepository.findByUserId(userId);
        cartRepository.deleteAll(items);
    }

}
