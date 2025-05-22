import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { StorageKeys } from '../../consts/enums/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  private readonly SESSION_KEY = StorageKeys.SESSION_DATA;

  constructor(private storage: LocalStorageService) {}

  private getSession(): Record<string, any> {
    return this.storage.getItem(this.SESSION_KEY) || {};
  }

  private setSession(session: Record<string, any>): void {
    this.storage.create(this.SESSION_KEY, session);
  }

  /**
   * Guarda una propiedad dentro del objeto de sesión.
   * @param key Clave de la propiedad.
   * @param value Valor a almacenar.
   */
  setProperty<T>(key: string, value: T): void {
    const session = this.getSession();
    session[key] = value;
    this.setSession(session);
  }

  /**
   * Recupera una propiedad del objeto de sesión.
   * @param key Clave de la propiedad.
   */
  getProperty<T>(key: string): T | null {
    const session = this.getSession();
    const value = session[key];
    try {
      return value ?? null;
    } catch (e) {
      console.error(`Error retrieving property "${key}" from session:`, e);
      return null;
    }
  }

  /**
   * Elimina una propiedad específica del objeto de sesión.
   * @param key Clave de la propiedad.
   */
  removeProperty(key: string): void {
    const session = this.getSession();
    if (session.hasOwnProperty(key)) {
      delete session[key];
      this.setSession(session);
    }
  }

  /**
   * Limpia todo el objeto de sesión.
   */
  clearSession(): void {
    this.storage.removeItem(this.SESSION_KEY);
  }

  /**
   * Reemplaza completamente el objeto de sesión.
   * Útil después del login.
   */
  replaceSession(data: Record<string, any>): void {
    this.setSession(data);
  }
}
