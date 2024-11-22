import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SelectOptionsModalComponent } from 'src/app/shared/components/select-options-modal/select-options-modal.component';

@Injectable({
  providedIn: 'root'
})
export class OpenSelectOptionsService {

  constructor(private modalCtrl: ModalController) { }

  async open<T = any>(componentProps: any = {}): Promise<T | undefined> {
    const modal = await this.modalCtrl.create({
      component: SelectOptionsModalComponent,
      componentProps,
      cssClass: 'option-select-modal',
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    return data as T;
  }
}
