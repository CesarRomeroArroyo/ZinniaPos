import { Injectable } from '@angular/core';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { DatabaseTablesEnum } from '../emuns/data-bases-tablesEnum';
@Injectable({
  providedIn: 'root'
})
export class LocalDataBaseService {

  data: any;
  db = new NgxIndexedDB('zinniaApp', 1);
  constructor() {
    this.openDB();
  }

  openDB() {
    this.db.openDatabase(1, evt => {
      
        let objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.Bank, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.BillInvoice, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.BillResolution, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.CashBox, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.Category, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.InventoryMoves, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.InventoryStock, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.Menus, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.Products, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.Profiles, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.Reservations, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.ShoppingBills, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.Tables, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.Thirds, { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore(DatabaseTablesEnum.Users, { keyPath: 'id', autoIncrement: true });
    });
  }

  initializeDB(){
    const administrador = { "nombre": "Administrador", "permisos": [ { "menu": "Aplicacion" }, { "menu": "Usuarios" }, { "menu": "Perfiles" }, { "menu": "Ventas" }, { "menu": "Nueva_Venta" }, { "menu": "Resumen_Venta" }, { "menu": "Clientes" }, { "menu": "Reservas" }, { "menu": "Caja" }, { "menu": "Abrir_Caja" }, { "menu": "Cerrar_caja" }, { "menu": "Salidas" }, { "menu": "Cuentas_Pagar" }, { "menu": "Inventario" }, { "menu": "Categorias" }, { "menu": "Stock" }, { "menu": "Movimientos" }, { "menu": "Recibir_Producto" }, { "menu": "Parametros" }, { "menu": "Empresa" }, { "menu": "Productos" }, { "menu": "Menus" }, { "menu": "Resoluciones" }, { "menu": "Proveedores" }, { "menu": "Impuestos" }, { "menu": "Reportes" } ] };
    const cajero = { "nombre": "Cajero", "permisos": [ { "menu": "Ventas" }, { "menu": "Nueva_Venta" }, { "menu": "Resumen_Venta" }, { "menu": "Clientes" }, { "menu": "Reservas" }, { "menu": "Abrir_Caja" }, { "menu": "Cerrar_caja" }, { "menu": "Salidas" }, { "menu": "Caja" } ] };
    this.add(DatabaseTablesEnum.Profiles, administrador);
    this.add(DatabaseTablesEnum.Profiles, cajero);
    const userAdmin = { "usuario": "admin", "password": "123", "nombre": "Administrador del Sistema", "perfil": { "nombre": "Administrador", "permisos": [ { "menu": "Aplicacion" }, { "menu": "Usuarios" }, { "menu": "Perfiles" }, { "menu": "Ventas" }, { "menu": "Nueva_Venta" }, { "menu": "Resumen_Venta" }, { "menu": "Clientes" }, { "menu": "Reservas" }, { "menu": "Caja" }, { "menu": "Abrir_Caja" }, { "menu": "Cerrar_caja" }, { "menu": "Salidas" }, { "menu": "Cuentas_Pagar" }, { "menu": "Inventario" }, { "menu": "Categorias" }, { "menu": "Stock" }, { "menu": "Movimientos" }, { "menu": "Recibir_Producto" }, { "menu": "Parametros" }, { "menu": "Empresa" }, { "menu": "Productos" }, { "menu": "Menus" }, { "menu": "Resoluciones" }, { "menu": "Proveedores" }, { "menu": "Impuestos" }, { "menu": "Reportes" } ], "id": "1" } };
    this.add(DatabaseTablesEnum.Users, userAdmin);
    const userCajero = { "usuario": "cajero", "password": "123", "nombre": "Cajero", "perfil": { "nombre": "Cajero", "permisos": [ { "menu": "Ventas" }, { "menu": "Nueva_Venta" }, { "menu": "Resumen_Venta" }, { "menu": "Clientes" }, { "menu": "Reservas" }, { "menu": "Abrir_Caja" }, { "menu": "Cerrar_caja" }, { "menu": "Salidas" }, { "menu": "Caja" } ], "id": 2 } };
    this.add(DatabaseTablesEnum.Users, userCajero);
  }

  getAll(table): any {
    return new Promise((resolve, reject) => {
      this.db.openDatabase(1).then(() => {
        this.db.getAll(table).then((data) => {
          return resolve(data);
       });
     });
    });
  }

  getById(table, id) {
    return new Promise((resolve, reject) => {
      this.db.openDatabase(1).then(() => {
        this.db.getByKey(table, parseInt(id, 10)).then((data) => {
          return resolve(data);
       });
     });
    });
  }

  add(table, data) {
    return new Promise((resolve, reject) => {
      this.db.openDatabase(1).then(() => {
        return this.db.add(table, data);
     });
    });
  }

  uptade(table, data) {
    return new Promise((resolve, reject) => {
      this.db.openDatabase(1).then(() => {
        return this.db.update(table, data);
     });
    });
  }

  delete(table, id) {
    return new Promise((resolve, reject) => {
      this.db.openDatabase(1).then(() => {
        return this.db.delete(table, id);
     });
    });
  }
}
