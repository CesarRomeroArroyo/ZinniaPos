import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { settingHeader } from './orders.consts';
import { CreateOrderComponent } from './components/create-order/create-order.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
  ]
})
export class OrdersComponent implements OnInit {

  public settingHeader = settingHeader;

  constructor(
    private _modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  public actionCompleted() {
    const data = { completed: true };
    this._modalCtrl.dismiss(data);
  }

  public async goToCreateOrder() {
    const modal = await this._modalCtrl.create({
      component: CreateOrderComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }

}
