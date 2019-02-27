import { ShoppingSuppliersModel } from "./shopping-suppliersModel";
import { ShoppingBillDetails } from './shopping-bills-detailsModel';

export class ShoppingBillModel {
    id: string;
    proveedor: ShoppingSuppliersModel;
    numero: string;
    fec_exp: Date;
    fec_venc: Date;
    cuotas: number;
    iva: number;
    retefuente: number;
    tot_gravado: string;
    tot_exe: string;
    tot_exc: string;
    base: string;
    total: string;
    detalles: ShoppingBillDetails[];
    estado: boolean;

}