import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Donation {
  _id?: string;
  project: string;
  amount: number;
  paymentStatus?: 'pending' | 'succeeded' | 'failed';
  receiptUrl?: string;
  donor?: any;
  createdAt?: string | Date;
}

@Injectable({ providedIn: 'root' })
export class DonationService {
  private readonly apiUrl = 'http://localhost:3000/api/donations';

  constructor(private readonly http: HttpClient) {}

  createDonation(donation: Donation): Observable<any> {
    return this.http.post<any>(this.apiUrl, donation);
  }

  getMyDonations(params?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, { params });
  }

  getDonationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getAllDonationsAdmin(params?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/all`, { params });
  }
}
