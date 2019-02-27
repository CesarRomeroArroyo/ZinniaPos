import { Injectable } from '@angular/core';
import { NgxIndexedDB } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})


export class DataService {
  data: any;
  db = new NgxIndexedDB('visitadorDB', 2);
  constructor() {
    this.openDB();
  }

  openDB() {
    this.db.openDatabase(1, evt => {
        let objectStore = evt.currentTarget.result.createObjectStore('agenda', { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore('doctores', { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore('usuario', { keyPath: 'id', autoIncrement: true });
        objectStore = evt.currentTarget.result.createObjectStore('muestras', { keyPath: 'id', autoIncrement: true });
    });
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
    return this.db.add(table, data);
  }

  uptade(table, data) {
    return this.db.update(table, data);
  }

  delete(table, id) {
    return this.db.delete(table, id);
  }
}
