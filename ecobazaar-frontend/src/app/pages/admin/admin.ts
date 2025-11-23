import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http'; // <-- ADD THIS IMPORT
import { AdminService, RoleRequest } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html'
})
export class Admin implements OnInit {
  name = localStorage.getItem('name'); // [cite: 952]
  requests: RoleRequest[] = [];
  
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
  this.adminService.getPendingRequests().subscribe({
    next: (data) => { this.requests = data; },
    error: (err: HttpErrorResponse) => { // <-- FIXED HERE
      console.error('Failed to load requests:', err);
    }
  });
}

  onApprove(request: RoleRequest): void {
  this.adminService.approveRequest(request.userId, request.requestedRole).subscribe({
    next: () => {
      alert(`${request.userName} approved as ${request.requestedRole}`);
      this.loadRequests();
    },
    error: (err: HttpErrorResponse) => { // <-- FIXED HERE
      alert('Approval failed: ' + err.message); // Adding a more descriptive error alert
      console.error(err);
    }
  });
  }
  onProductApprovalClick(): void {
        alert("INFO: Product approval feature coming soon! (Route: /admin/products-approval)");
    }
}