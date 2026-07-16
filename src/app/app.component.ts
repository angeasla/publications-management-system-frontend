import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/services/auth.service';
import { LanguageSelectorComponent } from './core/components/language-selector';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule, LanguageSelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Όνομα εκδόσεων - Διαχείριση';
  isLoggedIn = false;
  username: string | null = null;

  private destroyRef = inject(DestroyRef);
  private translate = inject(TranslateService);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(status => {
        this.isLoggedIn = status;
        this.username = this.authService.getCurrentUser();
      });
  }

  logout(): void {
    if (confirm(this.translate.instant('common.messages.confirmLogout'))) {
      this.authService.logout();
    }
  }
}
