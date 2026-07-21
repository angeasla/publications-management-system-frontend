import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Book, BookService } from '../../core/services/book.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  showActiveOnly: boolean = true;
  loading: boolean = true;

  constructor(
    private bookService: BookService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.filterBooks();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading books:', err);
        this.loading = false;
        alert(this.getErrorMessage(err));
      }
    });
  }

  filterBooks(): void {
    this.filteredBooks = this.books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (book.isbn && book.isbn.includes(this.searchTerm));
      
      const matchesActive = !this.showActiveOnly || book.active;
      
      return matchesSearch && matchesActive;
    });
  }

  toggleActiveFilter(): void {
    this.showActiveOnly = !this.showActiveOnly;
    this.filterBooks();
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
