import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private _loadingCtrl: LoadingController) {}

  public async showLoading(message: string = 'Cargando...') {
    if (this.loading) return;

    this.loading = await this._loadingCtrl.create({
      message,
      spinner: 'crescent',
      backdropDismiss: false
    });

    await this.loading.present();
  }

  public async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}