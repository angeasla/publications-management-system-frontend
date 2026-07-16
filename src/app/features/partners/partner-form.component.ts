import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Partner, PartnerService } from '../../core/services/partner.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-partner-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './partner-form.component.html',
  styleUrl: './partner-form.component.css'
})
export class PartnerFormComponent implements OnInit {
  isEditMode: boolean = false;
  partnerId?: number;

  partner: Partner = {
    name: '',
    category: 'BOOKSTORE',
    channelType: 'CONSIGNMENT',
    publisherSharePercentOverride: undefined,
    contactInfo: '',
    notes: '',
    active: true
  };

  constructor(
    private partnerService: PartnerService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.partnerId = +idParam;
      this.loadPartner(this.partnerId);
    }
  }

  loadPartner(id: number): void {
    this.partnerService.getPartner(id).subscribe({
      next: (data) => {
        this.partner = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading partner:', err);
        alert(this.getErrorMessage(err));
        this.router.navigate(['/partners']);
      }
    });
  }

  onSubmit(): void {
    if (!this.partner.name || !this.partner.category || !this.partner.channelType) {
      alert(this.translate.instant('common.validation.fillRequiredFields'));
      return;
    }

    if (this.isEditMode && this.partnerId) {
      this.partnerService.updatePartner(this.partnerId, this.partner).subscribe({
        next: () => {
          this.router.navigate(['/partners']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating partner:', err);
          alert(this.getErrorMessage(err));
        }
      });
    } else {
      this.partnerService.createPartner(this.partner).subscribe({
        next: () => {
          this.router.navigate(['/partners']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error creating partner:', err);
          alert(this.getErrorMessage(err));
        }
      });
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
