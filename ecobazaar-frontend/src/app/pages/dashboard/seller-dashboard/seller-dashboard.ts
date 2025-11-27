import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './seller-dashboard.html',
  styleUrls: ['./seller-dashboard.scss']
})
export class SellerDashboardComponent implements OnInit {

  // Dashboard Stats
  name: string = '';
  totalProducts: number = 0;
  ecoCertifiedCount: number = 0;
  pendingCount: number = 0;
  totalOrders: number = 0;
  revenue: number = 0;

  // Modal State
  showModal = false;
  isLoading = false;

  // File selected for upload
  selectedFile: File | null = null;

  // New Product Object
  newProduct = {
    name: '',
    details: '',
    price: null as any,
    carbonImpact: null as any,
    imageUrl: '',      // used only for preview
    category: '',
    ecoCertified: false
  };

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private productService: ProductService
  ) {
    this.name = this.auth.getName();
  }

  ngOnInit() {
    this.loadSellerStats();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;

    // Optional: preview image as base64 in the UI
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newProduct.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  loadSellerStats() {
    this.userService.getSellerProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        this.ecoCertifiedCount = products.filter((p: any) => p.ecoCertified).length;
        this.pendingCount = products.filter((p: any) => !p.ecoCertified).length;
      },
      error: (err: any) => console.error('Error loading seller products', err)
    });
  }

  // --- Modal Actions ---
  openModal() {
    console.log('Button clicked! Opening modal...');
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.isLoading) return;

    if (!this.selectedFile) {
      alert('Please select a product image.');
      return;
    }

    this.isLoading = true;

    this.productService.addProductWithFile(this.newProduct, this.selectedFile).subscribe({
      next: () => {
        alert('Product Submitted for Approval!');
        this.isLoading = false;
        this.closeModal();
        this.loadSellerStats();

        // Reset form
        this.newProduct = {
          name: '',
          details: '',
          price: null as any,
          carbonImpact: null as any,
          imageUrl: '',
          category: '',
          ecoCertified: false
        };
        this.selectedFile = null;
      },
      error: (err: any) => {
        console.error(err);
        alert('Failed to add product.');
        this.isLoading = false;
      }
    });
  }
}
