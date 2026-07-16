import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TopBook {
  bookId: number;
  title: string;
  quantitySold: number;
}

export interface DashboardSummary {
  activeBooksCount: number;
  totalPrintedCopies: number;
  totalSoldCopies: number;
  grossRevenues: number;
  totalExpenses: number;
  netCashFlow: number;
  topSellingBooks: TopBook[];
}

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }
}
