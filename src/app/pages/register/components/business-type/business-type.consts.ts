import { BusinessType } from "src/app/core/interfaces/bussiness/business-type.interface";

export const businessCategories: Array<BusinessType> = [
    {
        id: 'salud',
        title: 'Salud',
        description: 'Clínicas, consultorios, veterinarias…'
    },
    {
        id: 'retail',
        title: 'Retail / Tiendas',
        description: 'Ropa, zapatos, tecnología, alimentos…'
    },
    {
        id: 'servicios',
        title: 'Servicios',
        description: 'Peluquería, limpieza, reparación…'
    },
    {
        id: 'tecnologia',
        title: 'Tecnología',
        description: 'Desarrollo de software, marketing digital…'
    },
    {
        id: 'otro',
        title: 'Otro',
        description: ''
    }
];