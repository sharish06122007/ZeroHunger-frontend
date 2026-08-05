import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeFoodService {
  private apiUrl = `${environment.apiUrl}/home-food`;

  constructor(private http: HttpClient) {}

  createRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/requests`, data);
  }

  getNearbyRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/requests/nearby`);
  }

  acceptRequest(requestId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/requests/${requestId}/accept`, {});
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/${orderId}/status`, { status });
  }
}
