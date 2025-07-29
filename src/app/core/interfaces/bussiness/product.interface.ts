import { IProductCategory } from "./product-category.interface";
import { ISupplier } from "./supplier.interface";
import { ITax } from "./tax.interface";

export interface IProductPayload {
    userId: string;
    name:  string;
    description: string;
    costPrIce: string;
    salePrice: string;
    stock: number;
    categoryId: string;
    supplierId: string;
    taxId: string;
    images?: string[];
}

export interface IProduct {
    id: string;
    name:  string;
    description: string;
    costPrice: number;
    salePrice: number;
    stock: number;
    category: IProductCategory;
    supplierId: ISupplier;
    tax: ITax;
    images?: string[];
}