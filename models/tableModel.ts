import { TableDetailsModel } from './table-detailsModel';
import { ThirdModel } from './thirdsModel';
export class TableModel {
    id: string;
    mesa: string;
    idunico: string;
    fecha: Date;
    detalles: TableDetailsModel[];
    cocina: boolean;
    bar: boolean;
    vendedor: ThirdModel;
}