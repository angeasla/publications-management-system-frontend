import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Partner, PartnerService } from '../../core/services/partner.service';
import { Book, BookService } from '../../core/services/book.service';
import { DirectSalePost, DirectSaleService } from '../../core/services/direct-sale.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

interface FormDirectSaleLine {
  bookId: number;
  bookTitle: string;
  quantity: number;
  unitPrice: number;
}

@Component({
  selector: 'app-direct-sale-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './direct-sale-form.component.html',
  styleUrl: './direct-sale-form.component.css'
})
export class DirectSaleFormComponent implements OnInit {
  partners: Partner[] = [];
  books: Book[] = [];

  partnerId: number = 0; // 0 means no partner (retail/anonymous)
  eventName: string = '';
  saleDate: string = new Date().toISOString().split('T')[0];
  notes: string = '';

  // Added line inputs
  selectedBookId: number = 0;
  lineQuantity: number = 1;
  linePrice: number = 0;

  formLines: FormDirectSaleLine[] = [];

  constructor(
    private partnerService: PartnerService,
    private bookService: BookService,
    private directSaleService: DirectSaleService,
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
        this.partners = data;
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
          this.onBookChange();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading books:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  onBookChange(): void {
    if (this.selectedBookId === 0) return;
    const book = this.books.find(b => b.id === +this.selectedBookId);
    if (book) {
      this.linePrice = book.retailPrice;
    }
  }

  addLine(): void {
    if (this.selectedBookId === 0 || this.lineQuantity <= 0 || this.linePrice < 0) {
      alert(this.translate.instant('directSales.form.errors.selectBookQtyPrice'));
      return;
    }

    const book = this.books.find(b => b.id === +this.selectedBookId);
    if (!book) return;

    const existingIndex = this.formLines.findIndex(l => l.bookId === +this.selectedBookId);
    if (existingIndex > -1) {
      this.formLines[existingIndex].quantity += this.lineQuantity;
      this.formLines[existingIndex].unitPrice = this.linePrice;
    } else {
      this.formLines.push({
        bookId: book.id!,
        bookTitle: book.title,
        quantity: this.lineQuantity,
        unitPrice: this.linePrice
      });
    }

    this.lineQuantity = 1;
  }

  removeLine(index: number): void {
    this.formLines.splice(index, 1);
  }

  getCalculatedTotal(): number {
    return this.formLines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0);
  }

  onSubmit(): void {
    if (this.formLines.length === 0) {
      alert(this.translate.instant('directSales.form.errors.addBooks'));
      return;
    }

    const payload: DirectSalePost = {
      partner: this.partnerId > 0 ? { id: +this.partnerId } : null,
      eventName: this.eventName || undefined,
      saleDate: this.saleDate,
      notes: this.notes,
      lines: this.formLines.map(l => ({
        book: { id: l.bookId },
        quantity: l.quantity,
        unitPrice: l.unitPrice
      }))
    };

    const totalVal = this.getCalculatedTotal();
    const confirmMsg = this.translate.instant('directSales.form.confirmTitle') + '\n' +
      this.translate.instant('directSales.form.confirmTotal', { amount: totalVal.toFixed(2) }) + '\n' +
      this.translate.instant('directSales.form.confirmNote');

    if (confirm(confirmMsg)) {
      this.directSaleService.createDirectSale(payload).subscribe({
        next: () => {
          this.router.navigate(['/direct-sales']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error creating direct sale:', err);
          alert(this.getErrorMessage(err));
        }
      });
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
