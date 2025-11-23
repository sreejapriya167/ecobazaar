import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './seller-dashboard.html',
  // We point to the main dashboard SCSS so we don't have to copy-paste styles!
  styleUrls: ['../dashboard.scss'] 
})
export class SellerDashboardComponent implements OnInit {
  name: string = '';
  
  // Stats
  totalProducts: number = 0;
  ecoCertifiedCount: number = 0;
  pendingCount: number = 0;
  
  // Mock Data (Until you build Orders Backend)
  totalOrders: number = 0;
  revenue: number = 0;

  constructor(
    private userService: UserService, 
    private auth: AuthService
  ) {
    this.name = this.auth.getName();
  }

  ngOnInit() {
    this.loadSellerStats();
  }

 // ... inside class ...

  loadSellerStats() {
    // 👇 CHANGE THIS LINE: Use 'getSellerProducts()' instead of 'getProducts()'
    this.userService.getSellerProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        this.ecoCertifiedCount = products.filter((p: any) => p.ecoCertified).length;
        this.pendingCount = products.filter((p: any) => !p.ecoCertified).length;
      },
      error: (err) => console.error('Error loading seller products', err)
    });
  }
}