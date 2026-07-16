import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Partner, PartnerService } from '../../core/services/partner.service';
import { resolveHttpErrorKey } from '../../core/i18n/error-key-map';

@Component({
  selector: 'app-partner-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './partner-list.component.html',
  styleUrl: './partner-list.component.css'
})
export class PartnerListComponent implements OnInit {
  partners: Partner[] = [];
  filteredPartners: Partner[] = [];
  searchTerm: string = '';
  categoryFilter: string = '';
  showActiveOnly: boolean = true;

  constructor(
    private partnerService: PartnerService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    this.partnerService.getPartners().subscribe({
      next: (data) => {
        this.partners = data;
        this.filterPartners();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading partners:', err);
        alert(this.getErrorMessage(err));
      }
    });
  }

  filterPartners(): void {
    this.filteredPartners = this.partners.filter(partner => {
      const matchesSearch = partner.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (partner.contactInfo && partner.contactInfo.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesCategory = !this.categoryFilter || partner.category === this.categoryFilter;
      const matchesActive = !this.showActiveOnly || partner.active;

      return matchesSearch && matchesCategory && matchesActive;
    });
  }

  getCategoryLabel(category: string): string {
    const categoryMap: Record<string, string> = {
      'WAREHOUSE_DISTRIBUTOR': 'partners.categories.warehouseDistributor',
      'BOOKSTORE': 'partners.categories.bookstore',
      'DIY_SPACE': 'partners.categories.diySpace',
      'FESTIVAL': 'partners.categories.festival',
      'SCHOOL': 'partners.categories.school',
      'LIBRARY': 'partners.categories.library',
      'INDIVIDUAL': 'partners.categories.individual'
    };
    const key = categoryMap[category];
    return key ? this.translate.instant(key) : category;
  }

  getChannelTypeLabel(type: string): string {
    const typeMap: Record<string, string> = {
      'CONSIGNMENT': 'partners.channelTypes.consignment',
      'DIRECT_SALE': 'partners.channelTypes.directSale'
    };
    const key = typeMap[type];
    return key ? this.translate.instant(key) : type;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return this.translate.instant(resolveHttpErrorKey(error));
  }
}
