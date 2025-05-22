import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { addCircleOutline } from 'ionicons/icons';
import { QuickAccessItem } from 'src/app/core/interfaces/quick-access-list.interface';

@Component({
  selector: 'app-quick-access-list',
  templateUrl: './quick-access-list.component.html',
  styleUrls: ['./quick-access-list.component.scss'],
  standalone: true,
  imports: [
   IonicModule, RouterModule, CommonModule
  ],
})
export class QuickAccessListComponent implements OnChanges {
  
  @Input() items: QuickAccessItem[] = [];

  private registeredIcons = new Set<string>();

  constructor() {
    addIcons({addCircleOutline});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.items?.length) {
      const iconsToRegister: { [key: string]: string } = {};

      for (const item of this.items) {
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
}
