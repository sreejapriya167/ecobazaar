import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

// 👇 THESE IMPORTS ARE CRITICAL. 
// If these paths are wrong, VS Code will show red lines. Fix the path if needed.
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard';
import { UserDashboardComponent } from './user-dashboard/user-dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // 👇 YOU MUST ADD THEM HERE FOR HTML TO RECOGNIZE THEM
  imports: [
    CommonModule, 
    AdminDashboardComponent, 
    SellerDashboardComponent, 
    UserDashboardComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  role: string = '';

  constructor(private auth: AuthService) {
    // Get the role safely
    this.role = localStorage.getItem('role') || 'USER';
  }

  ngOnInit() {
    console.log("🚦 MAIN DASHBOARD DECISION:");
    console.log("👉 Current Role found in LocalStorage:", this.role);
    
    // Debugging logic to see what's happening in your browser console
    if (this.role.includes('ADMIN')) console.log("✅ Showing ADMIN View");
    else if (this.role.includes('SELLER')) console.log("✅ Showing SELLER View");
    else console.log("✅ Showing USER View");
  }
}