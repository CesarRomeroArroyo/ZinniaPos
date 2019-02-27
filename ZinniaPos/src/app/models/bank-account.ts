import { BankAccountTypeEnum } from '../emuns/bank-typeEnum';
export class BankAccountModel {
    id: string;
    numero: string;
    tipo: BankAccountTypeEnum;
}