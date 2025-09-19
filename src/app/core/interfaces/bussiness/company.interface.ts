import { BusinessCategoryId } from "../../consts/enums/business/business-category.enum";

export interface ICompany {
    id: string;
    userId: string;
    name: string;
    address: string;
    mobile: string;
    email: string;
    ruc: string
    category: BusinessCategoryId;
}