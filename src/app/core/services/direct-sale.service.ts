import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DirectSaleLineDTO {
  id?: number;
  bookId: number;
  bookTitle?: string;
  quantity: number;
  unitPrice: number;
}

export interface DirectSaleResponseDTO {
  id?: number;
  partnerId?: number;
  partnerName?: string;
  eventName?: string;
  saleDate: string;
  notes?: string;
  lines: DirectSaleLineDTO[];
}

export interface DirectSalePost {
  partner?: { id: number } | null;
  eventName?: string;
  saleDate: string;
  notes?: string;
  lines: { book: { id: number }; quantity: number; unitPrice: number }[];
}

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DirectSaleService {
  private apiUrl = `${environment.apiUrl}/direct-sales`;

  constructor(private http: HttpClient) { }

  getDirectSales(): Observable<DirectSaleResponseDTO[]> {
    return this.http.get<DirectSaleResponseDTO[]>(this.apiUrl);
  }

  getDirectSale(id: number): Observable<DirectSaleResponseDTO> {
    return this.http.get<DirectSaleResponseDTO>(`${this.apiUrl}/${id}`);
  }

  createDirectSale(directSale: DirectSalePost): Observable<DirectSaleResponseDTO> {
    return this.http.post<DirectSaleResponseDTO>(this.apiUrl, directSale);
  }
}
