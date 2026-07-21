import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Book, BookService, StockMovement } from '../../core/services/book.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';
import { GreekUppercasePipe } from '../../core/pipes/greek-uppercase.pipe';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule, GreekUppercasePipe],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  bookId!: number;
  book?: Book;
  movements: StockMovement[] = [];
  
  // Manual movement form model
  showMovementForm: boolean = false;
  newMovement: any = {
    movementType: 'RECEIVED_FROM_PRINTER',
    quantity: 0,
    movementDate: new Date().toISOString().split('T')[0],
    notes: ''
  };

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.bookId = +this.route.snapshot.paramMap.get('id')!;
    this.loadBookDetails();
  }

  loadBookDetails(): void {
    this.bookService.getBook(this.bookId).subscribe({
      next: (data) => {
        this.book = data;
        this.loadStockHistory();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading book details:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  loadStockHistory(): void {
    this.bookService.getBookStockHistory(this.bookId).subscribe({
      next: (data) => {
        this.movements = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading stock history:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  toggleMovementForm(): void {
    this.showMovementForm = !this.showMovementForm;
    if (this.showMovementForm) {
      // reset form
      this.newMovement = {
        movementType: 'RECEIVED_FROM_PRINTER',
        quantity: 0,
        movementDate: new Date().toISOString().split('T')[0],
        notes: ''
      };
    }
  }

  submitMovement(): void {
    if (this.newMovement.quantity === 0) {
      alert(this.translate.instant('books.details.movementForm.quantityZeroError'));
      return;
    }

    const payload: StockMovement = {
      bookId: this.bookId,
      movementType: this.newMovement.movementType,
      quantity: this.newMovement.quantity,
      movementDate: this.newMovement.movementDate,
      notes: this.newMovement.notes
    };

    this.bookService.addStockMovement(payload).subscribe({
      next: () => {
        alert(this.translate.instant('books.details.movementForm.success'));
        this.showMovementForm = false;
        this.loadBookDetails(); // reload data
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error adding stock movement:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  getMovementLabel(type: string): string {
    const keyMap: { [key: string]: string } = {
      'RECEIVED_FROM_PRINTER': 'books.details.movementTypes.receivedFromPrinter',
      'SHIPPED_TO_PARTNER': 'books.details.movementTypes.shippedToPartner',
      'SOLD_DIRECT': 'books.details.movementTypes.soldDirect',
      'SOLD_FROM_CONSIGNMENT': 'books.details.movementTypes.soldFromConsignment',
      'RETURNED': 'books.details.movementTypes.returned',
      'DONATED': 'books.details.movementTypes.donated',
      'DESTROYED': 'books.details.movementTypes.destroyed',
      'ADJUSTMENT_IN': 'books.details.movementTypes.adjustmentIn',
      'ADJUSTMENT_OUT': 'books.details.movementTypes.adjustmentOut'
    };
    const key = keyMap[type];
    return key ? this.translate.instant(key) : type;
  }

  getMovementBadgeClass(type: string): string {
    switch (type) {
      case 'RECEIVED_FROM_PRINTER':
      case 'RETURNED':
        return 'badge-success';
      case 'SHIPPED_TO_PARTNER':
      case 'SOLD_DIRECT':
      case 'SOLD_FROM_CONSIGNMENT':
        return 'badge-info';
      case 'DONATED':
      case 'DESTROYED':
        return 'badge-danger';
      case 'ADJUSTMENT_IN':
      case 'ADJUSTMENT_OUT':
        return 'badge-warning';
      default:
        return '';
    }
  }

  getMovementSign(type: string, qty: number): string {
    if (type === 'ADJUSTMENT_IN') {
      return `+${qty}`;
    }
    if (type === 'ADJUSTMENT_OUT') {
      return `-${qty}`;
    }
    // Positive types
    if (type === 'RECEIVED_FROM_PRINTER' || type === 'RETURNED') {
      return `+${qty}`;
    }
    // Negative types
    return `-${qty}`;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
