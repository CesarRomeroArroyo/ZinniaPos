import { MenuModel } from './menuModel';
import { TaxModel } from './taxModel';
export class TableDetailsModel {
    id: string;
    producto: MenuModel;
    cantidad: number;
    comentario: string;
    impuesto: TaxModel;
    val_impuesto: number;
    total: number;
    estado: boolean;
}