import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { StorageKeys } from '../../../consts/enums/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class SettingsStorageService {

  private readonly SETTING_KEY = StorageKeys.LOCAL_APP_SETTINGS;

  constructor(
    private storage: LocalStorageService
  ) {}

  /**
   * Guarda una propiedad dentro del objeto de configuraciones.
   * @param key Clave de la propiedad.
   * @param value Valor a almacenar.
   */
  setProperty<T>(key: string, value: T): void {
    const session = this.getSettings();
    session[key] = value;
    this.setSettings(session);
  }

  /**
   * Recupera una propiedad del objeto de configuraciones.
   * @param key Clave de la propiedad.
   */
  getProperty<T>(key: string): T | null {
    const session = this.getSettings();
    const value = session[key];
    try {
      return value ?? null;
    } catch (e) {
      console.error(`Error retrieving property "${key}" from setting:`, e);
      return null;
    }
  }

  /**
   * Elimina una propiedad específica del objeto de configuracion.
   * @param key Clave de la propiedad.
   */
  removeProperty(key: string): void {
    const settings = this.getSettings();
    if (settings.hasOwnProperty(key)) {
      delete settings[key];
      this.setSettings(settings);
    }
  }

  /**
   * Limpia todo el objeto de configuraciones.
   */
  clearSession(): void {
    this.storage.removeItem(this.SETTING_KEY);
  }

  /**
   * Reemplaza completamente el objeto de configuraciones.
   * Útil cuando se borra la data de la app.
   */
  replaceSettings(data: Record<string, any>): void {
    this.setSettings(data);
  }

  private getSettings(): Record<string, any> {
    return this.storage.getItem(this.SETTING_KEY) || {};
  }

  private setSettings(settings: Record<string, any>): void {
    this.storage.create(this.SETTING_KEY, settings);
  }
}
