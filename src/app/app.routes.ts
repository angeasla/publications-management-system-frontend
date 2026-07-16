import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { ChangePasswordComponent } from './features/auth/change-password.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { BookListComponent } from './features/books/book-list.component';
import { BookFormComponent } from './features/books/book-form.component';
import { BookDetailsComponent } from './features/books/book-details.component';
import { PartnerListComponent } from './features/partners/partner-list.component';
import { PartnerFormComponent } from './features/partners/partner-form.component';
import { PartnerStatementComponent } from './features/partners/partner-statement.component';
import { ShipmentListComponent } from './features/shipments/shipment-list.component';
import { ShipmentFormComponent } from './features/shipments/shipment-form.component';
import { SettlementListComponent } from './features/settlements/settlement-list.component';
import { SettlementFormComponent } from './features/settlements/settlement-form.component';
import { DirectSaleListComponent } from './features/direct-sales/direct-sale-list.component';
import { DirectSaleFormComponent } from './features/direct-sales/direct-sale-form.component';
import { PaymentListComponent } from './features/payments/payment-list.component';
import { PaymentFormComponent } from './features/payments/payment-form.component';
import { ExpenseListComponent } from './features/expenses/expense-list.component';
import { ExpenseFormComponent } from './features/expenses/expense-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      
      { path: 'books', component: BookListComponent },
      { path: 'books/new', component: BookFormComponent },
      { path: 'books/edit/:id', component: BookFormComponent },
      { path: 'books/details/:id', component: BookDetailsComponent },
      
      { path: 'partners', component: PartnerListComponent },
      { path: 'partners/new', component: PartnerFormComponent },
      { path: 'partners/edit/:id', component: PartnerFormComponent },
      { path: 'partners/statement', component: PartnerStatementComponent },
      { path: 'partners/statement/:id', component: PartnerStatementComponent },
      
      { path: 'shipments', component: ShipmentListComponent },
      { path: 'shipments/new', component: ShipmentFormComponent },

      { path: 'settlements', component: SettlementListComponent },
      { path: 'settlements/new', component: SettlementFormComponent },

      { path: 'direct-sales', component: DirectSaleListComponent },
      { path: 'direct-sales/new', component: DirectSaleFormComponent },

      { path: 'payments', component: PaymentListComponent },
      { path: 'payments/new', component: PaymentFormComponent },

      { 
        path: 'expenses', 
        component: ExpenseListComponent,
        canActivate: [roleGuard],
        data: { role: 'ROLE_ADMIN' }
      },
      { 
        path: 'expenses/new', 
        component: ExpenseFormComponent,
        canActivate: [roleGuard],
        data: { role: 'ROLE_ADMIN' }
      },
      { 
        path: 'expenses/edit/:id', 
        component: ExpenseFormComponent,
        canActivate: [roleGuard],
        data: { role: 'ROLE_ADMIN' }
      },
      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
