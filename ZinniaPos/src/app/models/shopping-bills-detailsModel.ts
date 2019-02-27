import { ProductModel } from './productModel';
export class ShoppingBillDetails {
    id: string;
    producto: ProductModel;
    cantidad: number;
    precio: number;
    base: number;
    iva: number;
    total: number;
    descripcion: string;
}