// cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:8086/api/cart';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getCartSummary(): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  addToCart(productId: number, quantity: number = 1): Observable<any> {
    const body = { id: null, userId: null, productId, quantity };
    return this.http.post<any>(this.apiUrl, body, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }


removeFromCart(cartItemId: number) {
  return this.http.delete(`${this.apiUrl}/${cartItemId}`, {
    headers: this.getAuthHeaders()
  });
}


checkout() {
  return this.http.post<string>('http://localhost:8086/api/cart/checkout', {}, {
    headers: this.getAuthHeaders(),
    responseType: 'text' as 'json'
  });
}


}
