import { Routes } from "@angular/router";
import { CustomerManagementComponent } from "./components/customer-management/customer-management.component";
import { CustomerUpsertComponent } from "./components/customer-upsert/customer-upsert.component";

export const customersRoutes: Routes = [
  { path: "", component: CustomerManagementComponent, data: { showTab: true } },
  {
    path: ":id",
    loadComponent: () =>
      import("./components/customer-detail/customer-detail.component").then(
        (m) => m.CustomerDetailComponent
      ),
  },
  { path: "customer-upsert", component: CustomerUpsertComponent, data: { showTab: true } },
];
