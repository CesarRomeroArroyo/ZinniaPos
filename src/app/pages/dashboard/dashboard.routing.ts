import { Routes } from "@angular/router";
import { DashboardRedirectGuard } from "src/app/core/guards/dashboard-redirect.guard";

export const dashboardRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard.component').then((m) => m.DashboardComponent),
        canActivate: [DashboardRedirectGuard],
    },
    {
        path: 'appointments',
        loadChildren: () => import('./appointments/appointments.routing').then((m) => m.appointmentsRoutes),
    },
    {
        path: 'orders',
        loadComponent: () => import('./orders/orders.component').then((m) => m.OrdersComponent),
        data: { showTab: true }
    },
     {
        path: 'customers',
        loadChildren: () => import('./customers/customers.routing').then((m) => m.customersRoutes),
        data: { showTab: true }
    },
];