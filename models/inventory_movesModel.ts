import { ShoppingSuppliersModel } from './shopping-suppliersModel';
import { CompanyModel } from './companyModel';
import { BillInvoiceModel } from './bill-invoiceModel';
import { ProductModel } from './productModel';

export class InventoryMovesModel {
    id: string;
    fecha: Date;
    tipo: string;
    detalle: string;
    origen: ShoppingSuppliersModel;
    destino: CompanyModel;
    producto: ProductModel;
    invoice: BillInvoiceModel;
    cantidad: number;
    almacen: string;
    caja: string;
}