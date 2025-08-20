import { CustomerUpsertComponent } from "src/app/pages/dashboard/customers/components/customer-upsert/customer-upsert.component";
import { IListTask } from "../types/progress-list.type";
import { BusinessCategoryId } from "src/app/core/consts/enums/business/business-category.enum";
import { BusinessHoursComponent } from "src/app/pages/dashboard/appointments/components/business-hours/business-hours.component";

export const initialTaskForHealth: Array<IListTask> = [
    {
        label: "Registrar clientes/pacientes",
        completed: false,
        component: CustomerUpsertComponent
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
    },
    {
        label: "Registrar proveedores",
        completed: false,
    },
    {
        label: "Crear impuestos",
        completed: false,
    },
    {
        label: "Agregar productos",
        completed: false,
    },
    {
        label: "Registrar clientes",
        completed: false,
        component: CustomerUpsertComponent,
    }
];

export const initalSettingTaskMap: Record<BusinessCategoryId, IListTask[]> = {
    [BusinessCategoryId.HEALTH]: initialTaskForHealth,
    [BusinessCategoryId.RETAIL]: initialTaskForRetail,
    [BusinessCategoryId.SERVICES]: initialTaskForServices,
    [BusinessCategoryId.TECHNOLOGY]: initialTaskForRetail,
    [BusinessCategoryId.OTHER]: [],
};

