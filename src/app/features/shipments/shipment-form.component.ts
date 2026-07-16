import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Partner, PartnerService } from '../../core/services/partner.service';
import { Book, BookService } from '../../core/services/book.service';
import { ShipmentPost, ShipmentService } from '../../core/services/shipment.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

interface FormLine {
  bookId: number;
  bookTitle: string;
  quantity: number;
}

@Component({
  selector: 'app-shipment-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './shipment-form.component.html',
  styleUrl: './shipment-form.component.css'
})
export class ShipmentFormComponent implements OnInit {
  partners: Partner[] = [];
  books: Book[] = [];
  
  partnerId: number = 0;
  shipmentDate: string = new Date().toISOString().split('T')[0];
  courier: string = '';
  trackingNumber: string = '';
  status: 'PREPARING' | 'SENT' | 'DELIVERED' = 'PREPARING';
  notes: string = '';
  
  // Selected line values
  selectedBookId: number = 0;
  lineQuantity: number = 1;
  
  formLines: FormLine[] = [];

  constructor(
    private partnerService: PartnerService,
    private bookService: BookService,
    private shipmentService: ShipmentService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadPartners();
    this.loadBooks();
  }

  loadPartners(): void {
    // Only load active partners for consignments preferably, but loading all active works
    this.partnerService.getPartners(true).subscribe({
      next: (data) => {
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
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading books:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  addLine(): void {
    if (this.selectedBookId === 0 || this.lineQuantity <= 0) {
      alert(this.translate.instant('shipments.form.errors.selectBookAndQty'));
      return;
    }

    // Check if book already added
    const existingIndex = this.formLines.findIndex(l => l.bookId === +this.selectedBookId);
    const book = this.books.find(b => b.id === +this.selectedBookId);

    if (!book) return;

    if (existingIndex > -1) {
      this.formLines[existingIndex].quantity += this.lineQuantity;
    } else {
      this.formLines.push({
        bookId: book.id!,
        bookTitle: book.title,
        quantity: this.lineQuantity
      });
    }

    // Reset line quantity inputs
    this.lineQuantity = 1;
  }

  removeLine(index: number): void {
    this.formLines.splice(index, 1);
  }

  onSubmit(): void {
    if (this.partnerId === 0) {
      alert(this.translate.instant('shipments.form.errors.selectPartner'));
      return;
    }

    if (this.formLines.length === 0) {
      alert(this.translate.instant('shipments.form.errors.addBooks'));
      return;
    }

    const payload: ShipmentPost = {
      partner: { id: +this.partnerId },
      shipmentDate: this.shipmentDate,
      courier: this.courier,
      trackingNumber: this.trackingNumber,
      status: this.status,
      notes: this.notes,
      lines: this.formLines.map(l => ({
        book: { id: l.bookId },
        quantity: l.quantity
      }))
    };

    let confirmMsg: string;
    if (this.status === 'SENT' || this.status === 'DELIVERED') {
      const statusLabel = this.status === 'SENT' 
        ? this.translate.instant('shipments.statuses.sent') 
        : this.translate.instant('shipments.statuses.delivered');
      confirmMsg = this.translate.instant('shipments.form.confirmSent', { status: statusLabel });
    } else {
      confirmMsg = this.translate.instant('shipments.form.confirmPreparing');
    }

    if (confirm(confirmMsg)) {
      this.shipmentService.createShipment(payload).subscribe({
        next: () => {
          this.router.navigate(['/shipments']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error creating shipment:', err);
          alert(this.getErrorMessage(err));
        }
      });
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
