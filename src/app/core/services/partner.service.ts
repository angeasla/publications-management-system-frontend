import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Partner {
  id?: number;
  name: string;
  category: string; // WAREHOUSE_DISTRIBUTOR | BOOKSTORE | DIY_SPACE | FESTIVAL | SCHOOL | LIBRARY | INDIVIDUAL
  channelType: string; // CONSIGNMENT | DIRECT_SALE
  publisherSharePercentOverride?: number;
  contactInfo?: string;
  notes?: string;
  active: boolean;
}

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private apiUrl = `${environment.apiUrl}/partners`;

  constructor(private http: HttpClient) { }

  getPartners(activeOnly = false): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${this.apiUrl}?activeOnly=${activeOnly}`);
  }

  getPartner(id: number): Observable<Partner> {
    return this.http.get<Partner>(`${this.apiUrl}/${id}`);
  }

  createPartner(partner: Partner): Observable<Partner> {
    return this.http.post<Partner>(this.apiUrl, partner);
  }

  updatePartner(id: number, partner: Partner): Observable<Partner> {
    return this.http.put<Partner>(`${this.apiUrl}/${id}`, partner);
  }
}
