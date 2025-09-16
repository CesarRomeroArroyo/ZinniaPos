import { Routes } from "@angular/router";
import { OrdersComponent } from "./orders.component";
import { OrdersManagementComponent } from "./components/orders-management/orders-management.component";
import { InitialSettingComponent } from "./components/initial-setting/initial-setting.component";

export const OrdersRoutes: Routes = [
  {
    path: "",
    component: OrdersComponent,
    children: [
      { path: "", redirectTo: "initial-setting", pathMatch: "full" },
      {
        path: "initial-setting",
        component: InitialSettingComponent,
        data: { showTab: true, title: "Pedidos" },
      },
      {
        path: "order-management",
        component: OrdersManagementComponent,
        data: { showTab: true, title: "Pedidos" },
      },
      {
        path: "order/:id",
        loadComponent: () =>
          import("./components/orders-detail/orders-detail.component")
            .then((m) => m.OrderDetailComponent),
        data: { showTab: false, title: "Detalle Pedido" },
      },
      { path: "**", redirectTo: "order-management" },
    ],
  },
];
