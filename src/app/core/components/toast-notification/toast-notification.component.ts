import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, AppNotification } from '../../services/notification.service';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.css'
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  notification: AppNotification | null = null;
  private sub?: Subscription;
  private timer?: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.sub = this.notificationService.notifications.subscribe(n => {
      this.notification = n;
      if (n) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.close();
        }, 5000);
      }
    });
  }

  close(): void {
    this.notification = null;
    this.notificationService.clear();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
