import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/logit-guard.service';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'items',
        loadChildren: () => import('./pages/items/items.module').then( m => m.ItemsPageModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
      },
      {
        path: 'customers',
        loadChildren: () => import('./pages/customers/customers.module').then( m => m.CustomersPageModule)
      },
      {
        path: 'waiters',
        loadChildren: () => import('./pages/waiters/waiters.module').then( m => m.WaitersPageModule)
      },
      {
        path: 'admins',
        loadChildren: () => import('./pages/admins/admins.module').then( m => m.AdminsPageModule)
      },
      {
        path: 'sales',
        loadChildren: () => import('./pages/sales/sales.module').then( m => m.SalesPageModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('./pages/expenses/expenses.module').then( m => m.ExpensesPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'admin-item',
        loadChildren: () => import('./pages/items/admin-item/admin-item.module').then( m => m.AdminItemPageModule)
      },
      {
        path: 'admin-item/:id',
        loadChildren: () => import('./pages/items/admin-item/admin-item.module').then( m => m.AdminItemPageModule)
      }, 
      {
        path: 'admin-categories',
        loadChildren: () => import('./pages/categories/admin-categories/admin-categories.module').then( m => m.AdminCategoriesPageModule)
      },
      {
        path: 'admin-categories/:id',
        loadChildren: () => import('./pages/categories/admin-categories/admin-categories.module').then( m => m.AdminCategoriesPageModule)
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'pos',
    loadChildren: () => import('./pages/pos/pos.module').then( m => m.PosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'inventory',
    loadChildren: () => import('./pages/inventory/inventory.module').then( m => m.InventoryPageModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
