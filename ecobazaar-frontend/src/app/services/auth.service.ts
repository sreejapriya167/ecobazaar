import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Ensure this matches your Backend Port
  private baseUrl = 'http://localhost:8086/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

register(data: any) {
  // 👇 ADD { responseType: 'text' }
  return this.http.post(`${this.baseUrl}/register`, data, { responseType: 'text' });
}
  login(data: any) {
    return this.http.post<any>(`${this.baseUrl}/login`, data).pipe(
      tap(res => {
        // 1. Store the data
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('name', res.name);

        // 2. Navigate to Home Page immediately
        this.router.navigate(['/']); 
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
  getName() {
    // This retrieves the name we saved during login
    return localStorage.getItem('name') || 'Guest';
  }
}