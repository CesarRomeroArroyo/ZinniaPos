import { Injectable } from '@angular/core';
import { LocalStorageService } from './storage/local-storage.service';
import { StorageKeys } from '../../consts/enums/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private localStorageService: LocalStorageService) { }

  public objectFilled(objeto: { [key: string]: any }, excludedKeys: string[]): boolean {
    for (let clave in objeto) {
      if (objeto.hasOwnProperty(clave) && !excludedKeys.includes(clave)) {
        if (!objeto[clave] || objeto[clave] === '') {
          return false; // Si se encuentra una clave vacía, retorna false
        }
      }
    }
    return true; // Si todas las claves están llenas (excepto las excluidas), retorna true
  }

  public isProfileCompleted(): boolean {
    const userProfile = this.localStorageService.getItem(StorageKeys.USER_DATA);
    return this.objectFilled(userProfile, ['profileImage', 'oneSignal']);
  }

  public hasUserLogged() {
    return this.localStorageService.getItem(StorageKeys.USER_DATA) && window.localStorage.getItem(StorageKeys.TOKEN);
  }

  public getRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
