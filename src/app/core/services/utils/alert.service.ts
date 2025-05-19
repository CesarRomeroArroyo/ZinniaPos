import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) {}

  async presentAlert(
    header: string,
    message: string,
    buttons: (string | { text: string; role?: string; handler?: () => void })[] = ['OK']
  ): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons
    });
    await alert.present();
  }

  async presentConfirm(
    header: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            if (onCancel) onCancel();
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            onConfirm();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertWithInputs(
    header: string,
    inputs: any[],
    onConfirm: (data: any) => void
  ): Promise<void> {
    const alert = await this.alertController.create({
      header,
      inputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            onConfirm(data);
          }
        }
      ]
    });
    await alert.present();
  }
}