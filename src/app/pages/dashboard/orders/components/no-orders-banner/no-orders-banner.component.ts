import { Component, OnInit } from '@angular/core';
import { CreateOrderComponent } from '../create-order/create-order.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-no-orders-banner',
  templateUrl: './no-orders-banner.component.html',
  styleUrls: ['./no-orders-banner.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class NoOrdersBannerComponent implements OnInit {

  constructor(
    private _modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  public async goToCreateOrder() {
    const modal = await this._modalCtrl.create({
      component: CreateOrderComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }

}
