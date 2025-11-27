import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/products';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchTerm = '';
  isEcoOnly = false;

  loading = false;
  error: string | null = null;

  // productId -> quantity shown on card
  quantityMap: { [productId: number]: number } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Could not load products. Ensure Backend is running.';
        this.loading = false;
      },
    });
  }

  // ----- Cart actions with quantity -----
  addToCart(product: Product): void {
    if (!product.ecoCertified) {
      alert('Only eco‑certified products can be added to the cart.');
      return;
    }

    const currentQty = this.quantityMap[product.id!] || 0;
    const newQty = currentQty + 1;

    this.cartService.addToCart(product.id!, 1).subscribe({
      next: () => {
        this.quantityMap[product.id!] = newQty;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add to cart');
      }
    });
  }

  decreaseQty(product: Product): void {
    const currentQty = this.quantityMap[product.id!] || 0;
    if (currentQty <= 0) return;

    const updated = currentQty - 1;

    this.cartService.addToCart(product.id!, -1).subscribe({
      next: () => {
        if (updated <= 0) {
          delete this.quantityMap[product.id!];
        } else {
          this.quantityMap[product.id!] = updated;
        }
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update cart');
      }
    });
  }
  // --------------------------------------

  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase().trim();
    this.applyFilters();
  }

  toggleEcoOnly(): void {
    this.isEcoOnly = !this.isEcoOnly;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(p => {
      const text = this.searchTerm;
      const matchSearch = !text ||
        (p.name && p.name.toLowerCase().includes(text)) ||
        (p.category && p.category.toLowerCase().includes(text));

      const matchEco = !this.isEcoOnly || p.ecoCertified;
      return matchSearch && matchEco;
    });
  }
}
