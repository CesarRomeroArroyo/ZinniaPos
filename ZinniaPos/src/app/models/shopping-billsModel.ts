import { ShoppingBillDetails } from './shopping-bills-detailsModel';
import { ThirdModel } from './thirdsModel';

export class ShoppingBillModel {
    id: string;
    proveedor: ThirdModel;
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