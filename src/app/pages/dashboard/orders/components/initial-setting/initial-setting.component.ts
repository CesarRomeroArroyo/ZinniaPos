import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BusinessCategoryId } from 'src/app/core/consts/enums/business/business-category.enum';
import { IListTask } from 'src/app/core/consts/types/progress-list.type';
import { QuickAccessItem } from 'src/app/core/interfaces/quick-access-list.interface';
import { AuthSessionService } from 'src/app/core/services/utils/auth-session.service';
import { QuickAccessService } from 'src/app/core/services/utils/quick-access.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { CustomerUpsertComponent } from '../../../customers/components/customer-upsert/customer-upsert.component';

@Component({
  selector: 'app-initial-setting',
  templateUrl: './initial-setting.component.html',
  styleUrls: ['./initial-setting.component.scss'],
})
export class InitialSettingComponent implements OnInit {

  public initialTask: IListTask[] = [];
  public businessCategoryId!: BusinessCategoryId | undefined;
  public userQuickAccess: QuickAccessItem[] = [];

  constructor(
    private _modalCtrl: ModalController,
    private _toastService: ToastService,
    private _authSession: AuthSessionService,
    private _quickAccessService: QuickAccessService,
  ) { }

  ngOnInit() {
    this.getQuickAccessLsit();
    this.defineTasks();
  }

  private getQuickAccessLsit() {
    this.businessCategoryId = this._authSession.getUserCompany()?.category;
    if(this.businessCategoryId) {
      this.userQuickAccess = this._quickAccessService.getUserQuickAccess(this.businessCategoryId);
    }
  }

  private defineTasks(): void {
    this.initialTask = [
      {
        label: "Crear categorias de productos",
        completed: false,
        onClick: () => this.goToUpsertCustomers(this.initialTask[0])
      },
      {
        label: "Registrar proveedores",
        completed: false,
        onClick: () => this.goToUpsertCustomers(this.initialTask[1])
      },
      {
        label: "Crear impuestos",
        completed: false,
        onClick: () => this.goToUpsertCustomers(this.initialTask[1])
      },
      {
        label: "Agregar productos",
        completed: false,
        onClick: () => this.goToUpsertCustomers(this.initialTask[1])
      },
      {
        label: "Registrar clientes",
        completed: false,
        onClick: () => this.goToUpsertCustomers(this.initialTask[1])
      }
    ];
  }

  private async goToUpsertCustomers(task: IListTask) {
    const modal = await this._modalCtrl.create({
      component: CustomerUpsertComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  
    if (data?.completed) { task.completed = true; }
  }

}
