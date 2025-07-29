export interface IProductCategory {
    id?: string;
    name: string;
    description: string;
}

export interface IProductCategoryPayload extends IProductCategory {
    userId: string;
}