import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Partner, PartnerService } from '../../core/services/partner.service';
import { Book, BookService } from '../../core/services/book.service';
import { SettlementPost, SettlementService } from '../../core/services/settlement.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

interface FormSettlementLine {
  bookId: number;
  bookTitle: string;
  quantitySold: number;
  unitPriceUsed: number;
}

@Component({
  selector: 'app-settlement-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './settlement-form.component.html',
  styleUrl: './settlement-form.component.css'
})
export class SettlementFormComponent implements OnInit {
  partners: Partner[] = [];
  books: Book[] = [];

  partnerId: number = 0;
  periodStart: string = '';
  periodEnd: string = '';
  reportedDate: string = new Date().toISOString().split('T')[0];
  hasQuantityDetail: boolean = true;
  receivedAmount: number = 0;
  notes: string = '';

  // Added line inputs
  selectedBookId: number = 0;
  lineQuantity: number = 1;
  linePrice: number = 0;

  formLines: FormSettlementLine[] = [];

  constructor(
    private partnerService: PartnerService,
    private bookService: BookService,
    private settlementService: SettlementService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadPartners();
    this.loadBooks();
  }

  loadPartners(): void {
    this.partnerService.getPartners(true).subscribe({
      next: (data) => {
        // Load consignment partners (WAREHOUSE_DISTRIBUTOR, BOOKSTORE, DIY_SPACE)
        this.partners = data.filter(p => p.channelType === 'CONSIGNMENT');
        if (this.partners.length > 0) {
          this.partnerId = this.partners[0].id!;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading partners:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  loadBooks(): void {
    this.bookService.getBooks(true).subscribe({
      next: (data) => {
        this.books = data;
        if (this.books.length > 0) {
          this.selectedBookId = this.books[0].id!;
          this.onBookOrPartnerChange();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading books:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  onBookOrPartnerChange(): void {
    if (this.selectedBookId === 0 || this.partnerId === 0) {
      return;
    }
    this.settlementService.getSuggestedPrice(this.selectedBookId, this.partnerId).subscribe({
      next: (price) => {
        this.linePrice = price;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error getting suggested price:', err);
      }
    });
  }

  addLine(): void {
    if (this.selectedBookId === 0 || this.lineQuantity <= 0 || this.linePrice < 0) {
      alert(this.translate.instant('settlements.form.errors.selectBookQtyPrice'));
      return;
    }

    const book = this.books.find(b => b.id === +this.selectedBookId);
    if (!book) return;

    const existingIndex = this.formLines.findIndex(l => l.bookId === +this.selectedBookId);
    if (existingIndex > -1) {
      this.formLines[existingIndex].quantitySold += this.lineQuantity;
      // Optionally update unitPriceUsed to the latest selected if desired
      this.formLines[existingIndex].unitPriceUsed = this.linePrice;
    } else {
      this.formLines.push({
        bookId: book.id!,
        bookTitle: book.title,
        quantitySold: this.lineQuantity,
        unitPriceUsed: this.linePrice
      });
    }

    // Reset quantity input
    this.lineQuantity = 1;
  }

  removeLine(index: number): void {
    this.formLines.splice(index, 1);
  }

  getCalculatedTotal(): number {
    if (!this.hasQuantityDetail) return 0;
    return this.formLines.reduce((sum, line) => sum + (line.quantitySold * line.unitPriceUsed), 0);
  }

  onSubmit(): void {
    if (this.partnerId === 0) {
      alert(this.translate.instant('settlements.form.errors.selectPartner'));
      return;
    }

    if (this.hasQuantityDetail && this.formLines.length === 0) {
      alert(this.translate.instant('settlements.form.errors.addBooks'));
      return;
    }

    const payload: SettlementPost = {
      partner: { id: +this.partnerId },
      periodStart: this.periodStart || undefined,
      periodEnd: this.periodEnd || undefined,
      reportedDate: this.reportedDate,
      hasQuantityDetail: this.hasQuantityDetail,
      receivedAmount: this.receivedAmount,
      notes: this.notes,
      lines: this.hasQuantityDetail ? this.formLines.map(l => ({
        book: { id: l.bookId },
        quantitySold: l.quantitySold,
        unitPriceUsed: l.unitPriceUsed
      })) : []
    };

    const totalVal = this.getCalculatedTotal();
    let confirmMsg = this.translate.instant('settlements.form.confirmTitle') + '\n';
    if (this.hasQuantityDetail) {
      confirmMsg += this.translate.instant('settlements.form.confirmSalesValue', { amount: totalVal.toFixed(2) }) + '\n';
    }
    confirmMsg += this.translate.instant('settlements.form.confirmReceivedAmount', { amount: this.receivedAmount.toFixed(2) }) + '\n';
    if (this.hasQuantityDetail) {
      confirmMsg += this.translate.instant('settlements.form.confirmStockNote');
    }

    if (confirm(confirmMsg)) {
      this.settlementService.createSettlement(payload).subscribe({
        next: () => {
          this.router.navigate(['/settlements']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error creating settlement:', err);
          alert(this.getErrorMessage(err));
        }
      });
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
