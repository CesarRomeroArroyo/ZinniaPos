import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;
  private autoDismissTimeout: any;
  private isPresented = false;


  constructor(private _loadingCtrl: LoadingController) {}

  public async showLoading(
    message: string = 'Cargando...',
    autoDismissMs?: number,
    force: boolean = false
  ) {
    if (this.loading) {
      if (!force) {
        console.warn('[LoadingService] Ya hay un loading activo');
        return;
      } else {
        await this.hideLoading();
      }
    }

    this.loading = await this._loadingCtrl.create({
      message,
      spinner: 'crescent',
      backdropDismiss: false
    });

    await this.loading.present();
    this.isPresented = true;

    if (autoDismissMs) {
      this.autoDismissTimeout = setTimeout(() => {
        console.warn(`[LoadingService] Auto-cerrando loading tras ${autoDismissMs}ms`);
        this.hideLoading();
      }, autoDismissMs);
    }
  }

  public async hideLoading() {
    try {
      if (this.autoDismissTimeout) {
        clearTimeout(this.autoDismissTimeout);
        this.autoDismissTimeout = null;
      }

      if (this.loading && this.isPresented) {
        console.log('[LoadingService] Cerrando loading...');
        await this.loading.dismiss();
      }
    } catch (error) {
      console.error('[LoadingService] Error al cerrar loading:', error);
    } finally {
      this.isPresented = false;
      this.loading = null;
    }
  }

  public isLoadingActive(): boolean {
    return !!this.loading;
  }
}