
import { ThirdModel } from './thirdsModel';
import { BillInvoiceModel } from './bill-invoiceModel';
import { ProductModel } from './productModel';

export class InventoryMovesModel {
    id: string;
    fecha: Date;
    tipo: string;
    detalle: string;
    origen: ThirdModel;
    destino: ThirdModel;
    producto: ProductModel;
    invoice: BillInvoiceModel;
    cantidad: number;
    almacen: string;
    caja: string;
}