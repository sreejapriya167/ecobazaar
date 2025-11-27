// src/main/java/com/ecobazaar/ecobazaar/dto/CartSummaryDto.java
package com.ecobazaar.ecobazaar.dto;

import java.util.List;
import com.ecobazaar.ecobazaar.model.Product;

public class CartSummaryDto {

    // NEW inner DTO for each cart entry
    public static class Line {
        private Long cartItemId;
        private int quantity;
        private Product product;  // includes ecoCertified, price, etc.

        public Line() {}

        public Line(Long cartItemId, int quantity, Product product) {
            this.cartItemId = cartItemId;
            this.quantity = quantity;
            this.product = product;
        }

        public Long getCartItemId() { return cartItemId; }
        public void setCartItemId(Long cartItemId) { this.cartItemId = cartItemId; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }

        public Product getProduct() { return product; }
        public void setProduct(Product product) { this.product = product; }
    }

    // use Line instead of CartItem
    private List<Line> items;
    private double totalPrice;
    private double totalCarbonUsed;   // kg
    private double totalCarbonSaved;  // kg
    private String ecoSuggestion;

    public CartSummaryDto() {}

    // constructor must match what you call in CartService
    public CartSummaryDto(List<Line> items, double totalPrice,
                          double totalCarbonUsed, double totalCarbonSaved,
                          String ecoSuggestion) {
        this.items = items;
        this.totalPrice = totalPrice;
        this.totalCarbonUsed = totalCarbonUsed;
        this.totalCarbonSaved = totalCarbonSaved;
        this.ecoSuggestion = ecoSuggestion;
    }

    public List<Line> getItems() { return items; }
    public void setItems(List<Line> items) { this.items = items; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public double getTotalCarbonUsed() { return totalCarbonUsed; }
    public void setTotalCarbonUsed(double totalCarbonUsed) { this.totalCarbonUsed = totalCarbonUsed; }

    public double getTotalCarbonSaved() { return totalCarbonSaved; }
    public void setTotalCarbonSaved(double totalCarbonSaved) { this.totalCarbonSaved = totalCarbonSaved; }

    public String getEcoSuggestion() { return ecoSuggestion; }
    public void setEcoSuggestion(String ecoSuggestion) { this.ecoSuggestion = ecoSuggestion; }
}
