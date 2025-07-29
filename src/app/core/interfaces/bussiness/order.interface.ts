import { ICustomer } from "./customers.interface";
import { IDiscount } from "./discount.interface";
import { IProduct } from "./product.interface";

export interface IOrderPayload {
    userId: string;
    clientId: string;
    items: Array<IOrderItem>;
    discounutId?: string;
    estimatedTax?: number;
    subtotal: number;
    total: number;
    status: OrderStatus;
}

export interface IOrder {
    id: string;
    client: ICustomer;
    items: Array<IOrderItem>;
    discounut?: IDiscount;
    estimatedTax?: number;
    subtotal: number;
    total: number;
    status: OrderStatus;
}

export interface IOrderItem {
    id: string;
    product: IProduct;
    quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'canceled';





