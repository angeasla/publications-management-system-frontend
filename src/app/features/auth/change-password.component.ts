import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  onSubmit(): void {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = this.translate.instant('common.validation.fillAllRequired');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = this.translate.instant('auth.changePassword.mismatch');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(this.newPassword)) {
      this.errorMessage = this.translate.instant('auth.changePassword.weakPassword');
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = this.translate.instant('auth.changePassword.success');
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = this.translate.instant(resolveHttpErrorKey(err));
      }
    });
  }
}
