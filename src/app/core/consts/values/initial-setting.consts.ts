import { CustomerUpsertComponent } from "src/app/pages/dashboard/customers/components/customer-upsert/customer-upsert.component";
import { IListTask } from "../types/progress-list.type";
import { BusinessCategoryId } from "src/app/core/consts/enums/business/business-category.enum";
import { BusinessHoursComponent } from "src/app/pages/dashboard/appointments/components/business-hours/business-hours.component";
import { ProductCategoryComponent } from "src/app/pages/dashboard/products/components/product-category/product-category.component";
import { ProductSupplierComponent } from "src/app/pages/dashboard/products/components/product-supplier/product-supplier.component";
import { ProductCustomerComponent } from "src/app/pages/dashboard/products/components/product-customer/product-customer.component";
import { ProductTaxComponent } from "src/app/pages/dashboard/products/components/product-tax/product-tax.component";
import { ProductAddComponent } from "src/app/pages/dashboard/products/components/product-add/product-add.component";

export const initialTaskForHealth: Array<IListTask> = [
    {
        label: "Registrar clientes/pacientes",
        completed: false,
        component: ProductCustomerComponent
    },
    {
        label: "Establecer horarios de atención",
        completed: false,
        component: BusinessHoursComponent
    }
];

export const initialTaskForServices: Array<IListTask> = [
    {
        label: "Registrar clientes",
        completed: false,
        component: CustomerUpsertComponent
    },
    {
        label: "Establecer horarios de atención",
        completed: false,
        component: BusinessHoursComponent,
    }
];

export const initialTaskForRetail: Array<IListTask> = [
    {
        label: "Crear categorias de productos",
        completed: false,
        component: ProductCategoryComponent,
    },
    {
        label: "Registrar proveedores",
        completed: false,
        component: ProductSupplierComponent,
    },
    {
        label: "Crear impuestos",
        completed: false,
        component: ProductTaxComponent,
    },
    {
        label: "Agregar productos",
        completed: false,
        component: ProductAddComponent,
    },
    {
        label: "Registrar clientes",
        completed: false,
        component: ProductCustomerComponent,
    }
];

export const initalSettingTaskMap: Record<BusinessCategoryId, IListTask[]> = {
    [BusinessCategoryId.HEALTH]: initialTaskForHealth,
    [BusinessCategoryId.RETAIL]: initialTaskForRetail,
    [BusinessCategoryId.SERVICES]: initialTaskForServices,
    [BusinessCategoryId.TECHNOLOGY]: initialTaskForRetail,
    [BusinessCategoryId.OTHER]: [],
};

