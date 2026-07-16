import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Book {
  id?: number;
  isbn?: string;
  title: string;
  author: string;
  publisherImprint?: string;
  retailPrice: number;
  publisherSharePercentDefault: number;
  diyPriceDefault?: number;
  productionCost: number;
  publicationDate?: string;
  active: boolean;
  warehouseStock?: number;
  consignmentStock?: number;
  totalStock?: number;
}

export interface StockMovement {
  id?: number;
  bookId: number;
  bookTitle?: string;
  partnerId?: number;
  partnerName?: string;
  movementType: string;
  quantity: number;
  movementDate: string;
  relatedShipmentId?: number;
  relatedSettlementId?: number;
  relatedDirectSaleId?: number;
  notes?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;
  private stockUrl = `${environment.apiUrl}/stock-movements`;

  constructor(private http: HttpClient) { }

  getBooks(activeOnly = false): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}?activeOnly=${activeOnly}`);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  getBookStockHistory(id: number): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.apiUrl}/${id}/stock-history`);
  }

  addStockMovement(movement: StockMovement): Observable<StockMovement> {
    return this.http.post<StockMovement>(this.stockUrl, movement);
  }
}
