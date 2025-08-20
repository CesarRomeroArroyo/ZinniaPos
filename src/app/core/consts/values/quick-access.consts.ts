import { BusinessCategoryId } from "src/app/core/consts/enums/business/business-category.enum";
import { QuickAccessItem } from "src/app/core/interfaces/quick-access-list.interface";
import { IToastOptions } from "../../interfaces/toast.interface";

export const quickAccessForServices = [
    {
        id: 'citas',
        icon: 'calendar-outline',
        label: 'Citas',
        route: '/citas'
    },
    {
        id: 'pacientes',
        label: 'Pacientes',
        icon: 'person-outline',
        route: '/patients'
    },
    {
        id: 'agenda',
        label: 'Agenda',
        icon: 'calendar-number-outline',
        route: '/agenda'
    },
];

export const quickAccessForRetail = [
    {
        id: 'pedidos',
        label: 'Pedidos',
        icon: 'cart-outline',
        route: '/pedidos'
    },
    {
        id: 'clientes',
        label: 'Clientes',
        icon: 'person-outline',
        route: '/customers'
    },
    {
        id: 'productos',
        label: 'Productos',
        icon: 'cube-outline',
        route: '/productos'
    },
];

export const avalaibleQuickAccess: QuickAccessItem[] = [
    {
        id: 'citas',
        icon: 'calendar-outline',
        label: 'Citas',
        route: '/citas'
    },
    {
        id: 'pacientes',
        label: 'Pacientes',
        icon: 'person-outline',
        route: '/patients'
    },
    {
        id: 'agenda',
        label: 'Agenda',
        icon: 'calendar-number-outline',
        route: '/agenda'
    },
    {
        id: 'pedidos',
        label: 'Pedidos',
        icon: 'cart-outline',
        route: '/pedidos'
    },
    {
        id: 'clientes',
        label: 'Clientes',
        icon: 'person-outline',
        route: '/customers'
    },
    {
        id: 'productos',
        label: 'Productos',
        icon: 'cube-outline',
        route: '/productos'
    }
];

export const quickAccessMap: Record<BusinessCategoryId, QuickAccessItem[]> = {
    [BusinessCategoryId.HEALTH]: quickAccessForServices,
    [BusinessCategoryId.RETAIL]: quickAccessForRetail,
    [BusinessCategoryId.SERVICES]: quickAccessForServices,
    [BusinessCategoryId.TECHNOLOGY]: [],
    [BusinessCategoryId.OTHER]: [],
};

export const quickAccessEditConfig = {
    title: "Modulos",
    description: "Agrega o elimina modulos adicionales a los establecidos por defecto para tu negocio."
}

export const quickAccessAddMessages: Record<string, IToastOptions> = {
    "success": { message: 'Modulo agregado correctamente.', color: 'success'},
    "error": { message: 'No se logro agregar el modulo.', color: 'danger'},
};

export const quickAccessDeletionMessage: Record<string, IToastOptions> = {
    "success": { message: 'Modulo removido correctamente.', color: 'success'},
    "error": { message: 'No se logro revover el modulo.', color: 'danger'},
};

export const quickAccessEditingActions: Record<string, Record<string, IToastOptions>> = {
    "save": quickAccessAddMessages,
    "delete": quickAccessDeletionMessage,
}
