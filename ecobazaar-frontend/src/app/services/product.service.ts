import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private apiUrl = 'http://localhost:8086/api/products';

  constructor(private http: HttpClient) {}

  // Get auth headers (without forcing JSON for multipart)
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
      // Do NOT set Content-Type here; browser will set boundary for FormData
    });
  }

  // Public: get all products
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // OLD: JSON addProduct (for non-file case, if you still need it)
  addProduct(product: any): Observable<any> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(this.apiUrl, product, { headers });
  }

  // NEW: Add product with image file (matches your @RequestParam MultipartFile)
  addProductWithFile(product: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', product.name);
    formData.append('details', product.details);
    formData.append('price', product.price);
    formData.append('carbonImpact', product.carbonImpact);
    formData.append('category', product.category);

    return this.http.post<any>(this.apiUrl, formData, {
      headers: this.getAuthHeaders()
      // no Content-Type: browser sets multipart/form-data boundary
    });
  }

  // Seller dashboard
  getSellerProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/seller`, {
      headers: this.getAuthHeaders()
    });
  }
}
