export interface ISupplier {
    id?: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    createdAt?: string;
}

export interface ISupplierPayload extends ISupplier {
    userId: string;
}