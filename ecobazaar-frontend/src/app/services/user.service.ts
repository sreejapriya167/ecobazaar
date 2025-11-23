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



  // 👇 FIX 3: Add this function for the Admin Button
  requestAdminAccess(): Observable<any> {
    // Simulating a backend call since you don't have an AdminRequestController yet
    return new Observable(observer => {
      setTimeout(() => {
        observer.next("Request sent");
        observer.complete();
      }, 1000);
    });
  }
  checkSellerRequestStatus(): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/seller-request/has-pending`, 
      { headers: this.getHeaders() }
    );
  }
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

  getProducts(): Observable<any[]> {
    // If you don't have a specific "all products" admin endpoint, reuse the public one
    return this.http.get<any[]>(`${this.apiUrl}/products`, { headers: this.getHeaders() });
  }

  approveSeller(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/approveSeller/${userId}`, {}, { headers: this.getHeaders() });
  }

  approveProduct(productId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/approveProduct/${productId}`, {}, { headers: this.getHeaders() });
  }

// ...
}