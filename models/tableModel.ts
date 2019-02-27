import { SellersModel } from './sellersModel';
import { TableDetailsModel } from './table-detailsModel';
export class TableModel {
    id: string;
    mesa: string;
    idunico: string;
    fecha: Date;
    detalles: TableDetailsModel[];
    cocina: boolean;
    bar: boolean;
    vendedor: SellersModel;
}