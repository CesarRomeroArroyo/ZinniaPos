import { BankModel } from './bankModel';
export class ShoppingSuppliersModel {
    id: string;
    raz_soc: string;
    num_ide: string;
    nom_rep_leg: string;
    ape_rep_leg: string;
    ide_rep_leg: string;
    tip_con: string;
    reg_cam: string;
    fecha_con: Date;
    ciudad: string;
    rut: string;
    banco: BankModel[];
    telefono: string;
    email: string;
    forma_pago: string;
    term_pago: string;
    auto_rete: boolean;
    estado: boolean;
}
