import { OriginOfOrder, OrderStatusValue } from "../../consts/enums/business/order.enum";
import { ICustomer } from "./customers.interface";
import { IDiscount } from "./discount.interface";
import { IProduct } from "./product.interface";

export interface IOrderPayload {
    userId: string;
    customerId: string;
    items: Array<IOrderItem>;
    discount?: number;
    estimatedTax?: number;
    subtotal: number;
    total: number;
    status: OrderStatus;
    origin: OriginOfOrder;
}

export interface IOrder {
    id: string;
    customer: ICustomer;
    items: Array<IOrderItem>;
    discounut?: IDiscount;
    estimatedTax?: number;
    subtotal: number;
    total: number;
    status: OrderStatus;
    origin: OriginOfOrder;
    createAt: string;
    updateAt: string;
}

export interface IOrderItem {
    id: string;
    product: IProduct;
    quantity: number;
}

export type OrderStatus = 
    OrderStatusValue.PENDING |
    OrderStatusValue.CONFIRMED |
    OrderStatusValue.DELIVERED |
    OrderStatusValue.CANCELED;





