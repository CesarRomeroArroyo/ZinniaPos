import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ordersGetMessages, settingHeader, waitingMessageOrderLoading } from './orders.consts';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { NoOrdersBannerComponent } from './components/no-orders-banner/no-orders-banner.component';
import { OrderService } from 'src/app/core/services/bussiness/order.service';
import { IOrder } from 'src/app/core/interfaces/bussiness/order.interface';
import { IUser } from 'src/app/core/interfaces/bussiness/user.interface';
import { AuthSessionService } from 'src/app/core/services/utils/auth-session.service';
import { LoadingService } from 'src/app/core/services/utils/loading.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { OrderListComponent } from './components/order-list/order-list.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    NoOrdersBannerComponent,
    OrderListComponent,
  ]
})
export class OrdersComponent implements OnInit {

  public settingHeader = settingHeader;
  public orders: IOrder[] = [];
  private _loggedUser: IUser | null = null;
  private isLoadingOrders = false;

  constructor(
    private _modalCtrl: ModalController,
    private _orderService: OrderService,
    private _toastService: ToastService,
    private _loadingService: LoadingService,
    private _authSessionService: AuthSessionService,
  ) { }

  ngOnInit() {  }

  async ionViewWillEnter() {
    this._loggedUser = this._authSessionService.getCurrentUser();
    await this.getOrders();
  }

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

  private async getOrders() {
    if (!this._loggedUser?.id || this.isLoadingOrders) return;

    this.isLoadingOrders = true;
    //await this._loadingService.showLoading(waitingMessageOrderLoading, undefined, true);
    try {
      const response = await firstValueFrom(this._orderService.getAllOrders(this._loggedUser!.id));
      this.orders = response;
      this.isLoadingOrders = false;
      //await this._loadingService.hideLoading();
    } catch(error) {
      //await this._loadingService.hideLoading();
      console.error(error);
      this._toastService.showToast(ordersGetMessages["error"]);
      this.isLoadingOrders = false;
    }
  }

}
