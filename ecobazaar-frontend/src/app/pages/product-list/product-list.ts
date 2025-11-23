import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/products';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {

  // Data Source
  products: Product[] = [];
  filteredProducts: Product[] = []; // Matches HTML *ngFor

  // Filter States
  searchTerm = '';
  isEcoOnly = false;

  // UI States
  loading = false;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data; // Show all initially
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Could not load products. Ensure Backend is running.';
        this.loading = false;
      },
    });
  }

  // --- ACTIONS (Matching HTML Events) ---

  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase().trim();
    this.applyFilters();
  }

  toggleEcoOnly(): void {
    this.isEcoOnly = !this.isEcoOnly;
    this.applyFilters();
  }

  // --- FILTER LOGIC ---
  applyFilters(): void {
    this.filteredProducts = this.products.filter(p => {
      // 1. Search Text Match (Checks Name or Category)
      const text = this.searchTerm;
      const matchSearch = !text || 
                          (p.name && p.name.toLowerCase().includes(text)) || 
                          (p.category && p.category.toLowerCase().includes(text));
      
      // 2. Eco Certified Match
      const matchEco = !this.isEcoOnly || p.ecoCertified;

      return matchSearch && matchEco;
    });
  }
}