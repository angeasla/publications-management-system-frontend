import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Partner, PartnerService } from '../../core/services/partner.service';
import { PaymentPost, PaymentService } from '../../core/services/payment.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent implements OnInit {
  partners: Partner[] = [];

  partnerId: number = 0;
  amount: number = 0;
  paymentDate: string = new Date().toISOString().split('T')[0];
  source: 'MANUAL' | 'DONATION' | 'OTHER_INCOME' = 'MANUAL';
  notes: string = '';

  constructor(
    private partnerService: PartnerService,
    private paymentService: PaymentService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    this.partnerService.getPartners(true).subscribe({
      next: (data) => {
        this.partners = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading partners:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  onSubmit(): void {
    if (this.source === 'MANUAL' && this.partnerId === 0) {
      alert(this.translate.instant('payments.form.errors.selectPartner'));
      return;
    }

    if (this.amount <= 0) {
      alert(this.translate.instant('payments.form.errors.invalidAmount'));
      return;
    }

    const payload: PaymentPost = {
      partner: this.partnerId > 0 ? { id: +this.partnerId } : null,
      amount: this.amount,
      paymentDate: this.paymentDate,
      source: this.source,
      notes: this.notes
    };

    const confirmMsg = this.translate.instant('payments.form.confirmTitle', { amount: this.amount.toFixed(2) });

    if (confirm(confirmMsg)) {
      this.paymentService.createManualPayment(payload).subscribe({
        next: () => {
          this.router.navigate(['/payments']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error creating payment:', err);
          alert(this.getErrorMessage(err));
        }
      });
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
