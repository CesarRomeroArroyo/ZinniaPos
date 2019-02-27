import { ClientModel } from './clientModel';
import { BillInvoiceDetailModel } from './bill-invoice-detailModel';
import { BillInvoicePayment } from './bill-invoice-paymentModel';
import { SellersModel } from './sellersModel';

export class BillInvoiceModel {
    id: string;
    numero: string;
    fecha: Date;
    cliente: ClientModel;
    iva: number;
    retefuente: number;
    base: number;
    propina: number;
    descuento: number;
    total: number;
    detalles: BillInvoiceDetailModel[];
    pagos: BillInvoicePayment[];
    almacen: string;
    caja: string;
    mesa: string;
    vendedor: SellersModel;
    estado: string;
}