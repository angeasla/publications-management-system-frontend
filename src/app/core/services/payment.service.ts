import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentResponseDTO {
  id?: number;
  partnerId?: number;
  partnerName?: string;
  amount: number;
  paymentDate: string;
  source: 'CONSIGNMENT_SETTLEMENT' | 'DIRECT_SALE' | 'MANUAL' | 'DONATION' | 'OTHER_INCOME';
  relatedSettlementId?: number;
  relatedDirectSaleId?: number;
  notes?: string;
}

export interface PaymentPost {
  partner?: { id: number } | null;
  amount: number;
  paymentDate: string;
  source?: 'MANUAL' | 'DONATION' | 'OTHER_INCOME';
  notes?: string;
}

export interface PartnerBalanceSummary {
  calculatedOwed: number;
  totalPaid: number;
  balance: number;
}

export interface LedgerEntry {
  date: string;
  type: 'SETTLEMENT' | 'PAYMENT';
  description: string;
  referenceId: number;
  debit: number;
  credit: number;
  runningBalance: number;
}

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;
  private partnerUrl = `${environment.apiUrl}/partners`;

  constructor(private http: HttpClient) { }

  getPayments(partnerId?: number): Observable<PaymentResponseDTO[]> {
    const url = partnerId ? `${this.apiUrl}?partnerId=${partnerId}` : this.apiUrl;
    return this.http.get<PaymentResponseDTO[]>(url);
  }

  createManualPayment(payment: PaymentPost): Observable<PaymentResponseDTO> {
    return this.http.post<PaymentResponseDTO>(this.apiUrl, payment);
  }

  getPartnerBalance(partnerId: number): Observable<PartnerBalanceSummary> {
    return this.http.get<PartnerBalanceSummary>(`${this.partnerUrl}/${partnerId}/balance`);
  }

  getPartnerStatement(partnerId: number): Observable<LedgerEntry[]> {
    return this.http.get<LedgerEntry[]>(`${this.partnerUrl}/${partnerId}/statement`);
  }
}
