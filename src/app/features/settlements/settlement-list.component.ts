import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SettlementResponseDTO, SettlementService } from '../../core/services/settlement.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-settlement-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './settlement-list.component.html',
  styleUrl: './settlement-list.component.css'
})
export class SettlementListComponent implements OnInit {
  settlements: SettlementResponseDTO[] = [];

  constructor(
    private settlementService: SettlementService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadSettlements();
  }

  loadSettlements(): void {
    this.settlementService.getSettlements().subscribe({
      next: (data) => {
        this.settlements = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading settlements:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  getCalculatedTotal(settlement: SettlementResponseDTO): number {
    if (!settlement.hasQuantityDetail || !settlement.lines) {
      return 0;
    }
    return settlement.lines.reduce((sum, line) => sum + (line.quantitySold * line.unitPriceUsed), 0);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
