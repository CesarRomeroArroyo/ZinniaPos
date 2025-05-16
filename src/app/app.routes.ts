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
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent),
    //canActivate: [UnauthenticatedGuard],
  },
  {
    path:'validate-code',
    loadComponent: ()=> import('./pages/validation-code/validation-code.component').then((m)=>m.ValidationCodeComponent),
  },
  {
    path:'onboarding',
    loadComponent:()=>import('./pages/onboarding/onbording.component').then((m)=>m.OnbordingComponent),
  },
  {
    path: 'appointments',
    loadComponent: () => import('./pages/dashboard/appointments/appointments.component').then((m) => m.AppointmentsComponent),
    children: appointmentsRoutes,
    canActivate: [UnauthenticatedGuard],
  }
];