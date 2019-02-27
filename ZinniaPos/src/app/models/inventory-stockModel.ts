import { ProductModel } from './productModel';
export class InventoryStockModel {
    id: string;
    almacen: string;
    producto: ProductModel;
    cantidad: number;
}