import { Injectable } from '@angular/core';
import { CryptoService } from '../crypto.service';

@Injectable({
	providedIn: 'root'
  })
export class LocalStorageService {

	constructor(private _cryptoService: CryptoService) { }

	/**
	 * Crea un elemento en el localstorage
	 */
	create(name: string, value: any): void {
		const dataEncrypt = this._cryptoService.encrypt(value);
		window.localStorage.setItem(name, dataEncrypt);
	}

	/**
	 * Obtiene un elemento mediante el name de localstorage
	 */
	getItem(name: string): any {
		const dataEncrypt = window.localStorage.getItem(name)!;
		if (dataEncrypt) {
		  try {
			return this._cryptoService.decrypt(dataEncrypt);
		  } catch (error) {
			// TODO Handle ERROR
		  }
		}
	}

	/**
	 * Elimina un elemento por name de localstorage
	 */
	removeItem(name: string): any {
		return window.localStorage.removeItem(name);
	}

	/**
	 * Elimina todos los elementos de localstorage
	 */
	clear(): void {
		return window.localStorage.clear();
	}

}

