import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Partner, PartnerService } from '../../core/services/partner.service';
import { LedgerEntry, PartnerBalanceSummary, PaymentService } from '../../core/services/payment.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';
import { GreekUppercasePipe } from '../../core/pipes/greek-uppercase.pipe';

@Component({
  selector: 'app-partner-statement',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, GreekUppercasePipe],
  templateUrl: './partner-statement.component.html',
  styleUrl: './partner-statement.component.css'
})
export class PartnerStatementComponent implements OnInit {
  partners: Partner[] = [];
  selectedPartnerId: number = 0;
  
  partnerDetails?: Partner;
  balanceSummary?: PartnerBalanceSummary;
  todayDate: Date = new Date();
  ledgerEntries: LedgerEntry[] = [];

  constructor(
    private partnerService: PartnerService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadActivePartners();
  }

  loadActivePartners(): void {
    this.partnerService.getPartners().subscribe({
      next: (data) => {
        this.partners = data;
        
        // Check if ID parameter exists in URL
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
          this.selectedPartnerId = +idParam;
          this.onPartnerChange();
        } else if (this.partners.length > 0) {
          this.selectedPartnerId = this.partners[0].id!;
          this.onPartnerChange();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading partners:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  onPartnerChange(): void {
    if (this.selectedPartnerId === 0) {
      return;
    }
    
    // Load partner metadata
    this.partnerService.getPartner(this.selectedPartnerId).subscribe(p => this.partnerDetails = p);

    // Load balance summary
    this.paymentService.getPartnerBalance(this.selectedPartnerId).subscribe({
      next: (summary) => {
        this.balanceSummary = summary;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading balance summary:', err);
        alert(this.getErrorMessage(err));
      }
    });

    // Load ledger statement entries
    this.paymentService.getPartnerStatement(this.selectedPartnerId).subscribe({
      next: (entries) => {
        // Reverse order for display (newest first) or keep chronological?
        // Chronological is usually preferred for ledger running balance. We will display it chronological.
        this.ledgerEntries = entries;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading ledger statement:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  printStatement(): void {
    window.print();
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
