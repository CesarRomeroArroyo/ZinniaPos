import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ordersGetMessages, settingHeader } from './orders.consts';
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
import { QuickAccessPanelComponent } from 'src/app/shared/components/quick-access-panel/quick-access-panel.component';
import { ProgressListComponent } from 'src/app/shared/components/progress-list/progress-list.component';
import { IListTask } from 'src/app/core/consts/types/progress-list.type';
import { InitialBusinessSettingService } from 'src/app/core/services/utils/initial-setting.service';

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
    QuickAccessPanelComponent,
    ProgressListComponent,
    CreateOrderComponent
]
})
export class OrdersComponent implements OnInit {

  public initialTask: IListTask[] = [];

  public settingHeader = settingHeader;
  public orders: IOrder[] = [];
  private _loggedUser: IUser | null = null;
  private isLoadingOrders = false;

  constructor(
    private _modalCtrl: ModalController,
    private _orderService: OrderService,
    private _toastService: ToastService,
    private _loadingService: LoadingService,
    private _authSession: AuthSessionService,
    private _authSessionService: AuthSessionService,
    private _initialBusinessSettingSrv : InitialBusinessSettingService
  ) { }

  ngOnInit() {  }

  async ionViewWillEnter() {
    this._loggedUser = this._authSessionService.getCurrentUser();
    this.getInitialTask();
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

  private getInitialTask() {
    this.initialTask = this._initialBusinessSettingSrv.getInitialUserTask();
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
