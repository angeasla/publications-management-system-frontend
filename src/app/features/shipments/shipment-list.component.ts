import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ShipmentDTO, ShipmentService } from '../../core/services/shipment.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './shipment-list.component.html',
  styleUrl: './shipment-list.component.css'
})
export class ShipmentListComponent implements OnInit {
  shipments: ShipmentDTO[] = [];
  filteredShipments: ShipmentDTO[] = [];
  statusFilter: string = '';

  constructor(
    private shipmentService: ShipmentService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadShipments();
  }

  loadShipments(): void {
    this.shipmentService.getShipments().subscribe({
      next: (data) => {
        this.shipments = data;
        this.filterShipments();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading shipments:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  filterShipments(): void {
    if (!this.statusFilter) {
      this.filteredShipments = this.shipments;
    } else {
      this.filteredShipments = this.shipments.filter(s => s.status === this.statusFilter);
    }
  }

  updateStatus(shipmentId: number, currentStatus: string): void {
    let nextStatus: 'PREPARING' | 'SENT' | 'DELIVERED';
    
    if (currentStatus === 'PREPARING') {
      nextStatus = 'SENT';
    } else if (currentStatus === 'SENT') {
      nextStatus = 'DELIVERED';
    } else {
      return; // Already delivered, cannot advance further in basic UI
    }

    const statusLabel = this.getStatusLabel(nextStatus);
    let confirmMsg = this.translate.instant('shipments.list.confirmStatusChange', { status: statusLabel });
    if (nextStatus === 'SENT') {
      confirmMsg += this.translate.instant('shipments.list.confirmSentNote');
    }

    if (confirm(confirmMsg)) {
      this.shipmentService.updateShipmentStatus(shipmentId, nextStatus).subscribe({
        next: () => {
          this.loadShipments();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating shipment status:', err);
          alert(this.getErrorMessage(err));
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PREPARING': return this.translate.instant('shipments.statuses.preparing');
      case 'SENT': return this.translate.instant('shipments.statuses.sent');
      case 'DELIVERED': return this.translate.instant('shipments.statuses.delivered');
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PREPARING': return 'badge-warning';
      case 'SENT': return 'badge-info';
      case 'DELIVERED': return 'badge-success';
      default: return '';
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
