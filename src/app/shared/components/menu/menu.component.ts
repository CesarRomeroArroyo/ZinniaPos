import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { menuItems } from './menu-consts';
import { Browser } from '@capacitor/browser';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LocalStorageService } from 'src/app/core/services/utils/local-storage.service';
import { CommonModule } from '@angular/common';
import { cashOutline, lockClosedOutline, personOutline, shieldCheckmarkOutline, shieldOutline, trashOutline, logOutOutline, chevronForward } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MenuComponent],
})
export class MenuComponent implements OnInit, OnChanges {

  @Input() contentId!: string;
  @Input() isOpen!: boolean;
  public menuItemsItems = menuItems;
  public user: any;
  public appVersion!: string;

  constructor(
    private router: Router,
    //private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private localStore: LocalStorageService,
  ) { 
    addIcons({ chevronForward, personOutline, cashOutline, lockClosedOutline, shieldCheckmarkOutline, shieldOutline, trashOutline, logOutOutline });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void { }

  async gotTo(item: any){    
    if(item?.route) {
      this.router.navigate([item.route]); 
    }

    if(item?.externalRoute) {
      await Browser.open({ url: item.externalRoute });
    }

  }

}
