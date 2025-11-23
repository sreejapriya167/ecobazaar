import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserReport } from '../models/user-report';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8086/api'; // Base API

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  getUserReport(): Observable<UserReport> {
    return this.http.get<UserReport>(`${this.apiUrl}/reports/user`, { headers: this.getHeaders() });
  }

  requestRoleUpgrade(role: 'ROLE_ADMIN' | 'ROLE_SELLER'): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/request-role?role=${role}`, 
      {}, 
      { headers: this.getHeaders(), responseType: 'text' }
    );
  }
  requestSellerAccess(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/seller-request/request`, 
      {}, 
      { headers: this.getHeaders(), responseType: 'text' }
    );
  }

  checkSellerRequestStatus(): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/seller-request/has-pending`, 
      { headers: this.getHeaders() }
    );
  }
  // src/app/services/user.service.ts

  // ... existing code ...

  // 👇 UPDATE THIS FUNCTION (No more setTimeout/simulation)
  requestAdminAccess(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/admin-request/request`, 
      {}, 
      { headers: this.getHeaders(), responseType: 'text' }
    );
  }

  // 👇 ADD THIS FUNCTION (To check status on load)
  checkAdminRequestStatus(): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/admin-request/has-pending`, 
      { headers: this.getHeaders() }
    );
  }

  // ... existing code ...
  // Check if user already has a pending request
  checkPendingRequest(role: 'ROLE_ADMIN' | 'ROLE_SELLER'): Observable<boolean> {
     return this.http.get<boolean>(
       `${this.apiUrl}/users/check-request?role=${role}`, 
       { headers: this.getHeaders() }
     );
  }
  // ... inside UserService class ...

  // 👇 ADD THESE MISSING FUNCTIONS

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`, { headers: this.getHeaders() });
  }

 // ... inside UserService class ...

  // 👇 UPDATE THIS FUNCTION
  // Change the URL from `${this.baseUrl}/products` to `${this.baseUrl}/admin/products`
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/admin/products`, 
      { headers: this.getHeaders() }
    );
  }
getSellerProducts(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/products/seller`, // This matches your SecurityConfig rule!
      { headers: this.getHeaders() }
    );
  }
  // ... rest of the code ...

  approveSeller(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/approveSeller/${userId}`, {}, { headers: this.getHeaders() });
  }

  approveProduct(productId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/approveProduct/${productId}`, {}, { headers: this.getHeaders() });
  }

// ...
}