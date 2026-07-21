import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) 
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'change-password', 
        loadComponent: () => import('./features/auth/change-password.component').then(m => m.ChangePasswordComponent) 
      },
      
      { 
        path: 'books', 
        loadComponent: () => import('./features/books/book-list.component').then(m => m.BookListComponent) 
      },
      { 
        path: 'books/new', 
        loadComponent: () => import('./features/books/book-form.component').then(m => m.BookFormComponent) 
      },
      { 
        path: 'books/edit/:id', 
        loadComponent: () => import('./features/books/book-form.component').then(m => m.BookFormComponent) 
      },
      { 
        path: 'books/details/:id', 
        loadComponent: () => import('./features/books/book-details.component').then(m => m.BookDetailsComponent) 
      },
      
      { 
        path: 'partners', 
        loadComponent: () => import('./features/partners/partner-list.component').then(m => m.PartnerListComponent) 
      },
      { 
        path: 'partners/new', 
        loadComponent: () => import('./features/partners/partner-form.component').then(m => m.PartnerFormComponent) 
      },
      { 
        path: 'partners/edit/:id', 
        loadComponent: () => import('./features/partners/partner-form.component').then(m => m.PartnerFormComponent) 
      },
      { 
        path: 'partners/statement', 
        loadComponent: () => import('./features/partners/partner-statement.component').then(m => m.PartnerStatementComponent) 
      },
      { 
        path: 'partners/statement/:id', 
        loadComponent: () => import('./features/partners/partner-statement.component').then(m => m.PartnerStatementComponent) 
      },
      
      { 
        path: 'shipments', 
        loadComponent: () => import('./features/shipments/shipment-list.component').then(m => m.ShipmentListComponent) 
      },
      { 
        path: 'shipments/new', 
        loadComponent: () => import('./features/shipments/shipment-form.component').then(m => m.ShipmentFormComponent) 
      },

      { 
        path: 'settlements', 
        loadComponent: () => import('./features/settlements/settlement-list.component').then(m => m.SettlementListComponent) 
      },
      { 
        path: 'settlements/new', 
        loadComponent: () => import('./features/settlements/settlement-form.component').then(m => m.SettlementFormComponent) 
      },

      { 
        path: 'direct-sales', 
        loadComponent: () => import('./features/direct-sales/direct-sale-list.component').then(m => m.DirectSaleListComponent) 
      },
      { 
        path: 'direct-sales/new', 
        loadComponent: () => import('./features/direct-sales/direct-sale-form.component').then(m => m.DirectSaleFormComponent) 
      },

      { 
        path: 'payments', 
        loadComponent: () => import('./features/payments/payment-list.component').then(m => m.PaymentListComponent) 
      },
      { 
        path: 'payments/new', 
        loadComponent: () => import('./features/payments/payment-form.component').then(m => m.PaymentFormComponent) 
      },

      { 
        path: 'expenses', 
        loadComponent: () => import('./features/expenses/expense-list.component').then(m => m.ExpenseListComponent),
        canActivate: [roleGuard],
        data: { role: 'ROLE_ADMIN' }
      },
      { 
        path: 'expenses/new', 
        loadComponent: () => import('./features/expenses/expense-form.component').then(m => m.ExpenseFormComponent),
        canActivate: [roleGuard],
        data: { role: 'ROLE_ADMIN' }
      },
      { 
        path: 'expenses/edit/:id', 
        loadComponent: () => import('./features/expenses/expense-form.component').then(m => m.ExpenseFormComponent),
        canActivate: [roleGuard],
        data: { role: 'ROLE_ADMIN' }
      },
      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
