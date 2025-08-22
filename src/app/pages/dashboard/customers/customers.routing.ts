import { Routes } from '@angular/router';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';

export const customersRoutes: Routes = [
  { path: '', component: CustomerManagementComponent, data: { showTab: true } },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/customer-detail/customer-detail.component')
        .then(m => m.CustomerDetailComponent),
  },
];
