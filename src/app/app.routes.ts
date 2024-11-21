import { Routes } from '@angular/router';
import { UnauthenticatedGuard } from './core/guards/auth/unauthenticated.guard';
import { appointmentsRoutes } from './pages/dashboard/appointments/appointments.routing';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
    //canActivate: [UnauthenticatedGuard],
  },
  {
    path: 'appointments',
    loadComponent: () => import('./pages/dashboard/appointments/appointments.component').then((m) => m.AppointmentsComponent),
    children: appointmentsRoutes,
    canActivate: [UnauthenticatedGuard],
  }
];