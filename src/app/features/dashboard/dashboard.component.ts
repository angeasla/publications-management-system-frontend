import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DashboardService, DashboardSummary } from '../../core/services/dashboard.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  summary?: DashboardSummary;
  loading: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading dashboard summary:', err);
        this.loading = false;
        alert(this.translate.instant(resolveHttpErrorKey(err)));
      }
    });
  }
}
