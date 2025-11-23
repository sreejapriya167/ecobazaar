// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define an interface for a role request item
export interface RoleRequest {
  userId: number;
  userName: string;
  requestedRole: 'ROLE_SELLER' | 'ROLE_ADMIN';
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = 'http://localhost:8080/api/admin';
  constructor(private http: HttpClient) {}

  getPendingRequests(): Observable<RoleRequest[]> {
    return this.http.get<RoleRequest[]>(`${this.base}/role-requests`);
  }

  approveRequest(userId: number, newRole: string): Observable<any> {
    // Backend API must update the user's role in the database
    return this.http.post(`${this.base}/approve-role`, { userId, newRole });
  }
}