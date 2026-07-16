import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Book, BookService } from '../../core/services/book.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnInit {
  isEditMode: boolean = false;
  bookId?: number;
  
  book: Book = {
    title: '',
    author: '',
    isbn: '',
    publisherImprint: '',
    retailPrice: 0,
    publisherSharePercentDefault: 0.50,
    diyPriceDefault: undefined,
    productionCost: 0,
    publicationDate: '',
    active: true
  };

  constructor(
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.bookId = +idParam;
      this.loadBook(this.bookId);
    }
  }

  loadBook(id: number): void {
    this.bookService.getBook(id).subscribe({
      next: (data) => {
        // Map to ensure share default represents decimal correct
        this.book = {
          ...data,
          publicationDate: data.publicationDate ? data.publicationDate : ''
        };
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading book:', err);
        alert(this.getErrorMessage(err));
        this.router.navigate(['/books']);
      }
    });
  }

  onSubmit(): void {
    if (!this.book.title || !this.book.author || this.book.retailPrice === null || this.book.retailPrice === undefined) {
      alert(this.translate.instant('books.form.errors.requiredFields'));
      return;
    }

    if (this.isEditMode && this.bookId) {
      this.bookService.updateBook(this.bookId, this.book).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating book:', err);
          alert(this.getErrorMessage(err));
        }
      });
    } else {
      this.bookService.createBook(this.book).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error creating book:', err);
          alert(this.getErrorMessage(err));
        }
      });
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
