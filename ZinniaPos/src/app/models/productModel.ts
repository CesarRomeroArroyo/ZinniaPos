import { CategoryModel } from './categoryModel';
import { TaxModel } from './taxModel';
import { PriceListModel } from './price-listModel';
export class ProductModel {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    categoria: CategoryModel;
    valor: PriceListModel[];
    impuestos: TaxModel[];
    tipo: number;
    lote: string;
    vencimiento: Date;
    estado: boolean;
}