import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Expense, ExpenseService } from '../../core/services/expense.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css'
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  categoryFilter: string = '';

  constructor(
    private expenseService: ExpenseService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
        this.filterExpenses();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading expenses:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  filterExpenses(): void {
    if (!this.categoryFilter) {
      this.filteredExpenses = this.expenses;
    } else {
      this.filteredExpenses = this.expenses.filter(e => e.category === this.categoryFilter);
    }
  }

  deleteExpense(id: number): void {
    if (confirm(this.translate.instant('expenses.list.confirmDelete'))) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.loadExpenses();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting expense:', err);
          alert(this.getErrorMessage(err));
        }
      });
    }
  }

  getCategoryLabel(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'PRINTING': 'expenses.categories.printing',
      'TRANSLATION': 'expenses.categories.translation',
      'ROYALTIES': 'expenses.categories.royalties',
      'SHIPPING': 'expenses.categories.shipping',
      'RENT_UTILITIES': 'expenses.categories.rentUtilities',
      'OFFICE_SUPPLIES': 'expenses.categories.officeSupplies',
      'MARKETING': 'expenses.categories.marketing',
      'OTHER': 'expenses.categories.other'
    };
    const key = categoryMap[category];
    return key ? this.translate.instant(key) : category;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
