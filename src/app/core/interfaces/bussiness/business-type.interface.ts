import { BusinessCategoryId } from "../../consts/enums/business/business-category.enum";

export interface BusinessType {
    id: BusinessCategoryId;
    title: string;
    description: string;
};