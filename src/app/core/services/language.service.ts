import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { NotificationService } from './notification.service';
import {
  LANGUAGE_CONFIG,
  DEFAULT_LANGUAGE,
  STORAGE_KEY,
  LanguageConfig
} from '../config/language.config';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translateService = inject(TranslateService);
  private readonly notificationService = inject(NotificationService);

  private readonly currentLanguageSubject = new BehaviorSubject<string>(DEFAULT_LANGUAGE);
  readonly currentLanguage$: Observable<string> = this.currentLanguageSubject.asObservable();

  constructor() {
    this.init();
  }

  init(): void {
    const supportedCodes = LANGUAGE_CONFIG.map(l => l.code);
    this.translateService.addLangs(supportedCodes);
    this.translateService.setDefaultLang(DEFAULT_LANGUAGE);

    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored && this.isSupported(stored)) {
      this.translateService.use(stored);
      this.currentLanguageSubject.next(stored);
    } else {
      this.translateService.use(DEFAULT_LANGUAGE);
      this.currentLanguageSubject.next(DEFAULT_LANGUAGE);
    }
  }

  setLanguage(code: string): void {
    if (!this.isSupported(code)) {
      return;
    }

    this.translateService.use(code).subscribe({
      next: () => {
        localStorage.setItem(STORAGE_KEY, code);
        this.currentLanguageSubject.next(code);
      },
      error: (err) => {
        console.error(`Failed to load language: ${code}`, err);
        this.notificationService.showError(
          this.translateService.instant('common.errors.languageChangeFailed')
        );
      }
    });
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.getValue();
  }

  getSupportedLanguages(): LanguageConfig[] {
    return LANGUAGE_CONFIG;
  }

  isSupported(code: string): boolean {
    return LANGUAGE_CONFIG.some(lang => lang.code === code);
  }
}
