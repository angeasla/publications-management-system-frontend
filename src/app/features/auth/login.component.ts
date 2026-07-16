import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { resolveHttpErrorKey, resolveErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    // If already logged in, redirect to dashboard
    if (this.authService.isLoggedInSync()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = this.translate.instant('common.validation.fillAllRequired');
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Login error:', err);

        // Network error
        if (err.status === 0) {
          this.errorMessage = this.translate.instant('common.errors.network');
          return;
        }

        // Known backend error
        const backendMessage = err.error?.message;
        const knownKey = resolveErrorKey(backendMessage);
        if (knownKey) {
          this.errorMessage = this.translate.instant(knownKey);
        } else {
          // Login-specific fallback: show invalid credentials
          this.errorMessage = this.translate.instant('auth.login.invalidCredentials');
        }
      }
    });
  }
}
