import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notification$ = new BehaviorSubject<AppNotification | null>(null);
  notifications = this.notification$.asObservable();

  showError(message: string): void {
    this.notification$.next({ message, type: 'error', timestamp: Date.now() });
  }

  showSuccess(message: string): void {
    this.notification$.next({ message, type: 'success', timestamp: Date.now() });
  }

  showWarning(message: string): void {
    this.notification$.next({ message, type: 'warning', timestamp: Date.now() });
  }

  clear(): void {
    this.notification$.next(null);
  }
}
