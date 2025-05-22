import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { ProgressListComponent } from 'src/app/shared/components/progress-list/progress-list.component';
import { CustomerUpsertComponent } from '../../../customers/components/customer-upsert/customer-upsert.component';
import { BusinessHoursComponent } from '../business-hours/business-hours.component';
import { IListTask } from 'src/app/core/consts/types/progress-list.type';
import { QuickAccessListComponent } from 'src/app/shared/components/quick-access-list/quick-access-list.component';
import { QuickAccessItem } from 'src/app/core/interfaces/quick-access-list.interface';
import { QuickAccessService } from 'src/app/core/services/utils/quick-access.service';
import { AuthSessionService } from 'src/app/core/services/utils/auth-session.service';
import { BusinessCategoryId } from 'src/app/core/consts/enums/business/business-category.enum';
import { SessionStorageService } from 'src/app/core/services/utils/session-storage.service';
import { StorageKeys } from 'src/app/core/consts/enums/storage-keys.enum';

@Component({
  selector: 'app-initial-setting',
  templateUrl: './initial-setting.component.html',
  styleUrls: ['./initial-setting.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ProgressListComponent,
    QuickAccessListComponent
  ]
})
export class InitialSettingComponent implements OnInit {

  public initialTask: IListTask[] = [];
  public businessCategoryId!: BusinessCategoryId | undefined;
  public userQuickAccess: QuickAccessItem[] = [];

  constructor(
    private _modalCtrl: ModalController,
    private _authSession: AuthSessionService,
    private _quickAccessService: QuickAccessService,
  ) { }

  ngOnInit(): void {
    this.getQuickAccessLsit();
    this.defineTasks();
  }

  public editQuickAccessItems() {
    
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
          label: "Registrar clientes/pacientes",
          completed: false,
          onClick: () => this.goToUpsertCustomers(this.initialTask[0])
      },
      {
          label: "Establecer horarios de atención",
          completed: false,
          onClick: () => this.goToBusinessHours(this.initialTask[1])
      }
    ];
  }

  private async goToBusinessHours(task: IListTask) {
    const modal = await this._modalCtrl.create({
      component: BusinessHoursComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data?.completed) { task.completed = true; }
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
