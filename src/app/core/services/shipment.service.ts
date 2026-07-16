import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ShipmentLineDTO {
  id?: number;
  bookId: number;
  bookTitle?: string;
  quantity: number;
  unitValueSnapshot?: number;
}

export interface ShipmentDTO {
  id?: number;
  partnerId: number;
  partnerName?: string;
  shipmentDate: string;
  courier?: string;
  trackingNumber?: string;
  status: 'PREPARING' | 'SENT' | 'DELIVERED';
  notes?: string;
  lines: ShipmentLineDTO[];
}

export interface ShipmentPost {
  id?: number;
  partner: { id: number };
  shipmentDate: string;
  courier?: string;
  trackingNumber?: string;
  status: 'PREPARING' | 'SENT' | 'DELIVERED';
  notes?: string;
  lines: { book: { id: number }; quantity: number }[];
}

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private apiUrl = `${environment.apiUrl}/shipments`;

  constructor(private http: HttpClient) { }

  getShipments(): Observable<ShipmentDTO[]> {
    return this.http.get<ShipmentDTO[]>(this.apiUrl);
  }

  getShipment(id: number): Observable<ShipmentDTO> {
    return this.http.get<ShipmentDTO>(`${this.apiUrl}/${id}`);
  }

  createShipment(shipment: ShipmentPost): Observable<ShipmentDTO> {
    return this.http.post<ShipmentDTO>(this.apiUrl, shipment);
  }

  updateShipmentStatus(id: number, status: 'PREPARING' | 'SENT' | 'DELIVERED'): Observable<ShipmentDTO> {
    return this.http.put<ShipmentDTO>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }
}
