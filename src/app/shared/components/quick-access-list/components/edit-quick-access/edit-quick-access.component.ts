import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { closeCircle } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { QuickAccessItem } from 'src/app/core/interfaces/quick-access-list.interface';

@Component({
  selector: 'app-edit-quick-access',
  templateUrl: './edit-quick-access.component.html',
  styleUrls: ['./edit-quick-access.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
  ],
})
export class EditQuickAccessComponent implements OnInit, OnChanges {

  @Input() title!: string;
  @Input() description!: string;
  @Input() quickAccessItems: Array<QuickAccessItem> = [];
  @Input() onDeleteItem!: (itemId: string) => boolean;
  @Input() onSelectItem!: (item: QuickAccessItem) => boolean;

  private registeredIcons = new Set<string>();

  constructor(
    private _modalCtrl: ModalController
  ) {
    addIcons({closeCircle});
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quickAccessItems'] && this.quickAccessItems?.length) {
      const iconsToRegister: { [key: string]: string } = {};
  
      for (const item of this.quickAccessItems) {
        if (!this.registeredIcons.has(item.icon)) {
          const icon = (icons as any)[item.icon];
          if (icon) {
            iconsToRegister[item.icon] = icon;
            this.registeredIcons.add(item.icon);
          } else {
            console.warn(`⚠️ Icon "${item.icon}" not found in ionicons/icons`);
          }
        }
      }

      if (Object.keys(iconsToRegister).length > 0) {
        addIcons(iconsToRegister);
      }
    }
  }

  public close() {
    this._modalCtrl.dismiss();
  }
  
  public async selectItem(item: QuickAccessItem) {
    if(this.onSelectItem) {
      const success = await this.onSelectItem(item);
      this._modalCtrl.dismiss(success ? "success" : "error");
    }
  }

  public async deleteItem(itemId: string) {
    if(this.onDeleteItem) {
      const success = await this.onDeleteItem(itemId);
      this._modalCtrl.dismiss(success ? "success" : "error");
    }
  }

}
