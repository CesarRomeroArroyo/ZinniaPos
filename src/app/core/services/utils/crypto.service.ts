import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {

  encrypt(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), environment.STORAGE_KEY).toString();
  }

  decrypt(encryptedData: string): any {
    return JSON.parse(CryptoJS.AES.decrypt(encryptedData, environment.STORAGE_KEY).toString(CryptoJS.enc.Utf8));
  }
}
