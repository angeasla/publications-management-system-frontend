import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LanguageService } from '../../services/language.service';
import { LanguageConfig } from '../../config/language.config';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="language-selector">
      <div class="language-selector-label">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="lang-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
        </svg>
        <span>{{ 'common.language' | translate }}</span>
      </div>
      <div class="language-options">
        @for (lang of languages; track lang.code) {
          <button
            class="language-btn"
            [class.active]="lang.code === currentLanguage"
            (click)="onLanguageChange(lang.code)"
            [attr.aria-label]="lang.name"
            [attr.aria-pressed]="lang.code === currentLanguage">
            {{ lang.name }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .language-selector {
      padding: 0.75rem 0.5rem;
    }

    .language-selector-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      padding: 0 0.25rem;
    }

    .lang-icon {
      width: 16px;
      height: 16px;
    }

    .language-options {
      display: flex;
      gap: 0.5rem;
    }

    .language-btn {
      flex: 1;
      padding: 0.5rem 0.75rem;
      background-color: transparent;
      color: var(--text-muted);
      border: 1px solid var(--card-border);
      border-radius: var(--border-radius-sm);
      font-family: var(--font-sans);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .language-btn:hover {
      background-color: rgba(255, 255, 255, 0.03);
      color: var(--text-main);
      border-color: var(--accent-color);
    }

    .language-btn.active {
      background-color: rgba(56, 189, 248, 0.1);
      color: var(--accent-color);
      border-color: var(--accent-color);
      font-weight: 600;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  languages: LanguageConfig[] = [];
  currentLanguage = '';

  ngOnInit(): void {
    this.languages = this.languageService.getSupportedLanguages();
    this.currentLanguage = this.languageService.getCurrentLanguage();

    this.languageService.currentLanguage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(lang => {
        this.currentLanguage = lang;
      });
  }

  onLanguageChange(code: string): void {
    if (code !== this.currentLanguage) {
      this.languageService.setLanguage(code);
    }
  }
}
