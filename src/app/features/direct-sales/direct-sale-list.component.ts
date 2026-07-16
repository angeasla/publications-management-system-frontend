import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DirectSaleResponseDTO, DirectSaleService } from '../../core/services/direct-sale.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-direct-sale-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './direct-sale-list.component.html',
  styleUrl: './direct-sale-list.component.css'
})
export class DirectSaleListComponent implements OnInit {
  directSales: DirectSaleResponseDTO[] = [];

  constructor(
    private directSaleService: DirectSaleService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadDirectSales();
  }

  loadDirectSales(): void {
    this.directSaleService.getDirectSales().subscribe({
      next: (data) => {
        this.directSales = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading direct sales:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  getCalculatedTotal(sale: DirectSaleResponseDTO): number {
    if (!sale.lines) return 0;
    return sale.lines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
