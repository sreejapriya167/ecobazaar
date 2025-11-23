import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { UserReport } from '../../../models/user-report';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['../dashboard.scss'] // Reuse styles
})
export class UserDashboardComponent implements OnInit {
  report: UserReport | null = null;
  name: string = '';
  sellerRequestStatus = 'NONE';
  adminRequestStatus = 'NONE';

  constructor(private userService: UserService, private auth: AuthService) {
    this.name = this.auth.getName();
  }

  ngOnInit() {
    console.log("👤 Loading User Data...");
    this.fetchData();
    this.checkRequests();
  }

  fetchData() {
    this.userService.getUserReport().subscribe({
      next: (data) => this.report = data,
      error: (err) => console.error(err)
    });
  }

  checkRequests() {
    this.userService.checkSellerRequestStatus().subscribe(isPending => {
      if (isPending) this.sellerRequestStatus = 'PENDING';
    });
    this.userService.checkAdminRequestStatus().subscribe(isPending => {
      if (isPending) this.adminRequestStatus = 'PENDING';
    });
  }

  requestSeller() {
    this.userService.requestSellerAccess().subscribe(() => this.sellerRequestStatus = 'PENDING');
  }

  requestAdmin() {
    this.userService.requestAdminAccess().subscribe(() => this.adminRequestStatus = 'PENDING');
  }
}