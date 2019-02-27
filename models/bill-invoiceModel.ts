import { BillInvoiceDetailModel } from './bill-invoice-detailModel';
import { BillInvoicePayment } from './bill-invoice-paymentModel';
import { ThirdModel } from './thirdsModel';
import { InvoiceStateEnum } from '../emuns/invioce-stateEnum';

export class BillInvoiceModel {
    id: string;
    numero: string;
    fecha: Date;
    cliente: ThirdModel;
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
    vendedor: ThirdModel;
    estado: InvoiceStateEnum;
}