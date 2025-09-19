import { Routes } from "@angular/router";
import { DashboardRedirectGuard } from "src/app/core/guards/dashboard-redirect.guard";

export const dashboardRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./dashboard.component").then((m) => m.DashboardComponent),
    canActivate: [DashboardRedirectGuard],
  },
  {
    path: "appointments",
    loadChildren: () =>
      import("./appointments/appointments.routing").then(
        (m) => m.appointmentsRoutes
      ),
  },
  {
    path: "orders",
    loadChildren: () =>
      import("./orders/orders.routing").then((m) => m.OrdersRoutes),
    data: { showTab: true },
  },

  {
    path: "customers",
    loadChildren: () =>
      import("./customers/customers.routing").then((m) => m.customersRoutes),
    data: { showTab: true },
  },
  {
    path: "patients",
    loadChildren: () =>
      import("./patients/patients.routing").then((m) => m.patientsRoutes),
    data: { showTab: true },
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.routing").then((m) => m.productsRoutes),
    data: { showTab: true },
  },
  {
    path: "inventory",
    loadChildren: () =>
      import("./inventory/inventory.routing").then((m) => m.inventoryRoutes),
    data: { showTab: true },
  },
];
