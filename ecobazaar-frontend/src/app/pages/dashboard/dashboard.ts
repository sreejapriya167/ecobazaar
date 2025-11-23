import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UserReport } from '../../models/user-report';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  name: string = '';
  role: string = '';
  report: UserReport | null = null;
  
  // User Status
  sellerRequestStatus: string = 'NONE';
  adminRequestStatus: string = 'NONE';

  // ADMIN DATA ARRAYS
  pendingSellers: any[] = [];
  pendingProducts: any[] = [];
  pendingAdmins: any[] = []; // Optional: If you add Admin approval logic

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.name = this.authService.getName();
    this.role = localStorage.getItem('role') || 'USER'; 
  }

 ngOnInit() {
    console.log("Current Role:", this.role); // Debugging

    // 👇 FIX: Check for 'ROLE_ADMIN' too
    if (this.role === 'ADMIN' || this.role === 'ROLE_ADMIN') {
      this.fetchAdminData();
    } else {
      this.fetchData(); // Normal User Stats
      
      // 👇 FIX: Check for 'ROLE_USER' too
      if (this.role === 'USER' || this.role === 'ROLE_USER') {
        this.checkExistingRequests();
      }
    }
  }

  // --- NORMAL USER FUNCTIONS (Keep your existing ones here) ---
  fetchData() {
    this.userService.getUserReport().subscribe({
      next: (data) => this.report = data,
      error: (err) => console.error(err)
    });
  }
  
  checkExistingRequests() {
    this.userService.checkSellerRequestStatus().subscribe(isPending => {
      if(isPending) this.sellerRequestStatus = 'PENDING';
    });
  }

  requestSeller() {
    if(!confirm('Apply to be a seller?')) return;
    this.userService.requestSellerAccess().subscribe({
      next: () => { alert('Request Sent!'); this.sellerRequestStatus = 'PENDING'; },
      error: (err) => alert(err.error || 'Failed')
    });
  }
  
  requestAdmin() {
    // Simulated
    if(!confirm('Apply for Admin?')) return;
    this.userService.requestAdminAccess().subscribe(() => {
      alert('Request Sent');
      this.adminRequestStatus = 'PENDING';
    });
  }

  // --- ADMIN FUNCTIONS ---

 fetchAdminData() {
  this.userService.getAllUsers().subscribe({
    next: (users: any[]) => {
      this.pendingSellers = users.filter((u: any) => u.sellerRequestPending === true && u.role !== 'SELLER');
    },
    error: (err: any) => {
      // 👇 Check this in your Console!
      console.error("🔥 ADMIN API ERROR:", err);
      
      if (err.status === 403) {
        alert("Access Denied: Your Token does not have Admin privileges. Please Re-Login.");
      }
    }
  });
  // ... similar for products
}

  onApproveSeller(userId: number) {
    if(!confirm('Approve this Seller?')) return;
    this.userService.approveSeller(userId).subscribe({
      next: () => {
        alert('Seller Approved!');
        this.fetchAdminData();
      },
      error: (err: any) => alert('Error: ' + err.message) // 👈 ADDED ": any"
    });
  }

  onApproveProduct(productId: number) {
    if(!confirm('Approve this Product for sale?')) return;
    this.userService.approveProduct(productId).subscribe({
      next: () => {
        alert('Product Approved!');
        this.fetchAdminData();
      },
      error: (err: any) => alert('Error: ' + err.message) // 👈 ADDED ": any"
    });
  }
}