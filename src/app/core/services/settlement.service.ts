import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SettlementLineDTO {
  id?: number;
  bookId: number;
  bookTitle?: string;
  quantitySold: number;
  unitPriceUsed: number;
}

export interface SettlementResponseDTO {
  id?: number;
  partnerId: number;
  partnerName?: string;
  periodStart?: string;
  periodEnd?: string;
  reportedDate: string;
  hasQuantityDetail: boolean;
  receivedAmount: number;
  notes?: string;
  lines: SettlementLineDTO[];
}

export interface SettlementPost {
  partner: { id: number };
  periodStart?: string;
  periodEnd?: string;
  reportedDate: string;
  hasQuantityDetail: boolean;
  receivedAmount: number;
  notes?: string;
  lines?: { book: { id: number }; quantitySold: number; unitPriceUsed: number }[];
}

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettlementService {
  private apiUrl = `${environment.apiUrl}/settlements`;

  constructor(private http: HttpClient) { }

  getSettlements(): Observable<SettlementResponseDTO[]> {
    return this.http.get<SettlementResponseDTO[]>(this.apiUrl);
  }

  getSettlement(id: number): Observable<SettlementResponseDTO> {
    return this.http.get<SettlementResponseDTO>(`${this.apiUrl}/${id}`);
  }

  createSettlement(settlement: SettlementPost): Observable<SettlementResponseDTO> {
    return this.http.post<SettlementResponseDTO>(this.apiUrl, settlement);
  }

  getSuggestedPrice(bookId: number, partnerId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/suggested-prices?bookId=${bookId}&partnerId=${partnerId}`);
  }
}
