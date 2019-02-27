import { CategoryModel } from './categoryModel';
import { ProductModel } from './productModel';
import { TaxModel } from './taxModel';
import { PriceListModel } from './price-listModel';
export class MenuModel {
    id: string;
    codigo: string;
    tipo: number;
    nombre: string;
    descripcion: string;
    categoria: CategoryModel;
    valor: PriceListModel[];
    impuestos: TaxModel[];
    vencimiento: Date;
    lote: string;
    productos: ProductModel[];
    estado: boolean;
}