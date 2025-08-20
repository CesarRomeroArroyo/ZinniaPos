import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { ProgressListComponent } from 'src/app/shared/components/progress-list/progress-list.component';
import { IListTask } from 'src/app/core/consts/types/progress-list.type';
import { QuickAccessItem } from 'src/app/core/interfaces/quick-access-list.interface';
import { QuickAccessService } from 'src/app/core/services/utils/quick-access.service';
import { AuthSessionService } from 'src/app/core/services/utils/auth-session.service';
import { BusinessCategoryId } from 'src/app/core/consts/enums/business/business-category.enum';
import { EditQuickAccessComponent } from 'src/app/shared/components/quick-access-list/components/edit-quick-access/edit-quick-access.component';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { quickAccessAddMessages, quickAccessEditConfig } from './initial-setting.consts';
import { InitialBusinessSettingService } from 'src/app/core/services/utils/initial-setting.service';
import { QuickAccessPanelComponent } from 'src/app/shared/components/quick-access-panel/quick-access-panel.component';
import { Subscription } from 'rxjs';

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
    QuickAccessPanelComponent,
  ]
})
export class InitialSettingComponent implements OnInit, OnDestroy  {

  public initialTask: IListTask[] = [];
  public businessCategoryId!: BusinessCategoryId | undefined;
  public userQuickAccess: QuickAccessItem[] = [];

  private tasksSubscription?: Subscription;

  constructor(
    private readonly _modalCtrl: ModalController,
    private readonly _toastService: ToastService,
    private readonly _authSession: AuthSessionService,
    private readonly _quickAccessService: QuickAccessService,
    private readonly _initialBusinessSetting: InitialBusinessSettingService,
  ) { }

  ngOnInit(): void {
    this.getQuickAccessLsit();
    this.loadInitialTasks();
    this.subscribeToTasksChanges();
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  public showInitalSettingPanel(): boolean {
    return !this._initialBusinessSetting.getSetting()?.completed;
  }

  public async addQuickAccessItem(item: QuickAccessItem): Promise<boolean>  {
    const userCompany = this._authSession.getUserCompany()
    const success = await this._quickAccessService.addCustomItem(userCompany!.category, item);
    return success;
  }

  public async removeQuickAccessItem(itemId: string): Promise<boolean> {
    const success = await this._quickAccessService.removeCustomItem(itemId);
    return success;
  }

  public async editQuickAccessItems() {
    const allQuickAccess = this._quickAccessService.getQuickAccesslist();
    const modal = await this._modalCtrl.create({
      component: EditQuickAccessComponent,
      componentProps: {
        ...quickAccessEditConfig,
        onSelectItem: this.addQuickAccessItem.bind(this),
        onDeleteItem: this.removeQuickAccessItem.bind(this),
        quickAccessItems: allQuickAccess
      },
      cssClass: 'option-select-modal',
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.getQuickAccessLsit();
      this._toastService.showToast(quickAccessAddMessages[data]);
    }
  }

  private getQuickAccessLsit() {
    this.businessCategoryId = this._authSession.getUserCompany()?.category;
    if (this.businessCategoryId) {
      this.userQuickAccess = this._quickAccessService.getUserQuickAccess(this.businessCategoryId);
    }
  }

  private loadInitialTasks(): void {
    this.initialTask = this._initialBusinessSetting.getInitialUserTask();
  }

  private subscribeToTasksChanges(): void {
    this.tasksSubscription = this._initialBusinessSetting.getTasks$().subscribe({
      next: (tasks: IListTask[]) => {
        if(tasks.length > 0) {
          this.initialTask = [...tasks];
        } else {
          this.loadInitialTasks();
        }
        console.log('Tasks updated:', this.initialTask);
      },
      error: (error) => {
        console.error('Error subscribing to tasks changes:', error);
      }
    });
  } 
}
