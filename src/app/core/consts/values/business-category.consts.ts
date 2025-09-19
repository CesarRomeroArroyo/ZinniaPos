import { BusinessType } from "../../interfaces/bussiness/business-type.interface";
import { BusinessCategoryId } from "../enums/business/business-category.enum";

export const businessCategories: Array<BusinessType> = [
    {
        id: BusinessCategoryId.HEALTH,
        title: 'Salud',
        description: 'Clínicas, consultorios, veterinarias…'
    },
    {
        id: BusinessCategoryId.RETAIL,
        title: 'Retail / Tiendas',
        description: 'Ropa, zapatos, tecnología, alimentos…'
    },
    {
        id: BusinessCategoryId.SERVICES,
        title: 'Servicios',
        description: 'Peluquería, limpieza, reparación…'
    },
    {
        id: BusinessCategoryId.TECHNOLOGY,
        title: 'Tecnología',
        description: 'Desarrollo de software, marketing digital…'
    },
    {
        id: BusinessCategoryId.OTHER,
        title: 'Otro',
        description: ''
    }
];