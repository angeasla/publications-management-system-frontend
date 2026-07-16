import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Expense, ExpenseService } from '../../core/services/expense.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
})
export class ExpenseFormComponent implements OnInit {
  isEditMode: boolean = false;
  expenseId?: number;

  expense: Expense = {
    description: '',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
    category: 'PRINTING',
    notes: ''
  };

  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.expenseId = +idParam;
      this.loadExpense(this.expenseId);
    }
  }

  loadExpense(id: number): void {
    this.expenseService.getExpense(id).subscribe({
      next: (data) => {
        this.expense = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading expense:', err);
        alert(this.getErrorMessage(err));
        this.router.navigate(['/expenses']);
      }
    });
  }

  onSubmit(): void {
    if (!this.expense.description || this.expense.amount <= 0 || !this.expense.expenseDate || !this.expense.category) {
      alert(this.translate.instant('expenses.form.errors.requiredFields'));
      return;
    }

    if (this.isEditMode && this.expenseId) {
      this.expenseService.updateExpense(this.expenseId, this.expense).subscribe({
        next: () => {
          this.router.navigate(['/expenses']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating expense:', err);
          alert(this.getErrorMessage(err));
        }
      });
    } else {
      this.expenseService.createExpense(this.expense).subscribe({
        next: () => {
          this.router.navigate(['/expenses']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error creating expense:', err);
          alert(this.getErrorMessage(err));
        }
      });
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
