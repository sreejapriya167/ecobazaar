import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['../dashboard.scss'] // Reuse your existing styles!
})
export class AdminDashboardComponent implements OnInit {
  pendingSellers: any[] = [];
  pendingProducts: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.fetchAdminData();
  }

  fetchAdminData() {
    console.log("🛡️ Loading Admin Data...");
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.pendingSellers = users.filter((u: any) => u.sellerRequestPending === true && u.role !== 'ROLE_SELLER');
      },
      error: (err) => console.error(err)
    });

    this.userService.getProducts().subscribe({
      next: (products) => {
        this.pendingProducts = products.filter((p: any) => p.ecoCertified === false);
      }
    });
  }

  onApproveSeller(id: number) {
    if(confirm('Approve?')) {
      this.userService.approveSeller(id).subscribe(() => {
        alert('Approved'); 
        this.fetchAdminData();
      });
    }
  }

  onApproveProduct(id: number) {
    if(confirm('Approve?')) {
      this.userService.approveProduct(id).subscribe(() => {
        alert('Approved'); 
        this.fetchAdminData();
      });
    }
  }
}