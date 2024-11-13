import { Routes } from '@angular/router';
import { UnauthenticatedGuard } from './core/guards/auth/unauthenticated.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [UnauthenticatedGuard],
  }
];