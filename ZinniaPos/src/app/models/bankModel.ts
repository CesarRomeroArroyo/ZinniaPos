import { BankAccountModel } from './bank-account';
export class BankModel {
    id: string;
    nombre: string;
    cuentas: BankAccountModel[];
    estado: boolean;

}