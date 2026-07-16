import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaymentResponseDTO, PaymentService } from '../../core/services/payment.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css'
})
export class PaymentListComponent implements OnInit {
  payments: PaymentResponseDTO[] = [];

  constructor(
    private paymentService: PaymentService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading payments:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  getSourceLabel(source: string): string {
    switch (source) {
      case 'CONSIGNMENT_SETTLEMENT': return this.translate.instant('payments.sources.consignmentSettlement');
      case 'DIRECT_SALE': return this.translate.instant('payments.sources.directSale');
      case 'MANUAL': return this.translate.instant('payments.sources.manual');
      case 'DONATION': return this.translate.instant('payments.sources.donation');
      case 'OTHER_INCOME': return this.translate.instant('payments.sources.otherIncome');
      default: return source;
    }
  }

  getSourceBadgeClass(source: string): string {
    switch (source) {
      case 'CONSIGNMENT_SETTLEMENT': return 'badge-info';
      case 'DIRECT_SALE': return 'badge-success';
      case 'MANUAL': return 'badge-warning';
      case 'DONATION': return 'badge-success';
      case 'OTHER_INCOME': return 'badge-info';
      default: return '';
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
