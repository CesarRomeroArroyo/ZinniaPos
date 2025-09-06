// src/app/pages/dashboard/customers/customers.routes.ts
import { Routes } from "@angular/router";
import { CustomerManagementComponent } from "./components/customer-management/customer-management.component";
import { PruebaBackendComponent } from "./components/prueba-backend/prueba-backend.component";

export const customersRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: CustomerManagementComponent,
    data: { showTab: true, title: "Clientes" },
  },
  {
    path: "prueba-backend",
    component: PruebaBackendComponent,
    data: { showTab: true, title: "Prueba backend" },
  },
  {
    path: ":id",
    loadComponent: () =>
      import("./components/customer-detail/customer-detail.component")
        .then((m) => m.CustomerDetailComponent),
    data: { showTab: false, title: "Detalle Cliente" },
  },
  { path: "**", redirectTo: "" },
];
