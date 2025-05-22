import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IToastOptions } from '../../interfaces/toast.interface';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private _toastController: ToastController
  ) { }

  public async showToast(message: IToastOptions) {

    const toast = await this._toastController.create({
      message: message.message,
      position: message.position ?? 'bottom',
      color: message.color,
      duration: message.duration ?? 4000,
      cssClass: 'toast--color-default'
    });

    await toast.present();
  }

}
