import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { LanguageSelectorComponent } from './core/components/language-selector';
import { ToastNotificationComponent } from './core/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    TranslateModule, 
    LanguageSelectorComponent,
    ToastNotificationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Όνομα εκδόσεων - Διαχείριση';
  isLoggedIn = false;
  username: string | null = null;
  sidebarOpen = false;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  private destroyRef = inject(DestroyRef);
  private translate = inject(TranslateService);
  private notificationService = inject(NotificationService);

  constructor(private authService: AuthService) {
    // Override global window.alert to use our custom toast notification system
    window.alert = (message: any) => {
      const msgStr = String(message).toLowerCase();
      if (msgStr.includes('επιτυχία') || msgStr.includes('success') || msgStr.includes('επιτυχώς')) {
        this.notificationService.showSuccess(String(message));
      } else if (msgStr.includes('error') || msgStr.includes('σφάλμα') || msgStr.includes('λάθος') || msgStr.includes('απέτυχε') || msgStr.includes('υποχρεωτικό') || msgStr.includes('συμπληρώστε')) {
        this.notificationService.showError(String(message));
      } else {
        this.notificationService.showWarning(String(message));
      }
    };
  }

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
