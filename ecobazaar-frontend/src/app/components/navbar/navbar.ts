import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink], // ✅ Add CommonModule here
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  
  // Make 'auth' public so HTML can use 'auth.isLoggedIn()'
  constructor(public auth: AuthService, private router: Router) {}

  // Optional: If you want to handle logout here
  handleLogout() {
    this.auth.logout();
  }
}