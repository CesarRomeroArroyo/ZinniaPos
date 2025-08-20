import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { QuickAccessListComponent } from '../quick-access-list/quick-access-list.component';
import { QuickAccessItem } from 'src/app/core/interfaces/quick-access-list.interface';
import { BusinessCategoryId } from 'src/app/core/consts/enums/business/business-category.enum';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { AuthSessionService } from 'src/app/core/services/utils/auth-session.service';
import { QuickAccessService } from 'src/app/core/services/utils/quick-access.service';
import { EditQuickAccessComponent } from '../quick-access-list/components/edit-quick-access/edit-quick-access.component';
import { quickAccessAddMessages, quickAccessEditConfig } from 'src/app/core/consts/values/quick-access.consts';

@Component({
  selector: 'app-quick-access-panel',
  templateUrl: './quick-access-panel.component.html',
  styleUrls: ['./quick-access-panel.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    QuickAccessListComponent
  ]
})
export class QuickAccessPanelComponent implements OnInit {

  @Input() title = 'Gestión rápida';
  
  public userQuickAccess: QuickAccessItem[] = [];
  public businessCategoryId!: BusinessCategoryId | undefined;

  constructor(
    private _modalCtrl: ModalController,
    private _toastService: ToastService,
    private _authSession: AuthSessionService,
    private _quickAccessService: QuickAccessService,
  ) { }

  ngOnInit() {
    this.getQuickAccessList();
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
    if(data) {
      this.getQuickAccessList();
      this._toastService.showToast(quickAccessAddMessages[data]);
    }
  }

  private getQuickAccessList() {
    this.businessCategoryId = this._authSession.getUserCompany()?.category;
    if(this.businessCategoryId) {
      this.userQuickAccess = this._quickAccessService.getUserQuickAccess(this.businessCategoryId);
    }
  }
}
