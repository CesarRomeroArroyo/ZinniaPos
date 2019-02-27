export class BillResolutionsModel {
    id: string;
    bodega: string;
    almacen: string;
    caja: string;
    numero: string;
    fecha: Date;
    conse_inicial: string;
    conse_final: string;
    pref_factura: string;
    aplica_todos: boolean;
    estado: boolean;
}