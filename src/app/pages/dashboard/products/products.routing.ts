import { Routes } from "@angular/router";
import { ProductManagementComponent } from "./components/product-management/product-management.component";
import { InitialSettingComponent } from "./components/initial-setting/initial-setting.component";
import { ProductAddComponent } from "./components/product-add/product-add.component";
import { ProductCategoryComponent } from "./components/product-category/product-category.component";

export const productsRoutes: Routes = [
  // /products  ->  /products/product-management
  { path: "", redirectTo: "product-management", pathMatch: "full" },

  {
    path: "initial-setting",
    component: InitialSettingComponent,
    data: { showTab: true, title: "Productos" },
  },
  {
    path: "product-management",
    component: ProductManagementComponent,
    data: { showTab: true, title: "Productos" },
  },

  { path: "product-add", component: ProductAddComponent },
  { path: "product-category", component: ProductCategoryComponent },

  // 🔹 Detalle (hijo directo de /products)
  {
    path: ":id",
    loadComponent: () =>
      import("./components/product-detail/product-detail.component")
        .then((m) => m.ProductDetailComponent),
  },

  // Alias por si quedó el typo en algún enlace antiguo
  { path: "product-managament", redirectTo: "product-management", pathMatch: "full" },
];
