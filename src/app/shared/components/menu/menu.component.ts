import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { menuItems } from './menu-consts';
import { Browser } from '@capacitor/browser';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LocalStorageService } from 'src/app/core/services/utils/storage/local-storage.service';
import { CommonModule } from '@angular/common';
import { cashOutline, lockClosedOutline, personOutline, shieldCheckmarkOutline, shieldOutline, trashOutline, logOutOutline, chevronForward } from 'ionicons/icons';
import { AuthSessionService } from 'src/app/core/services/utils/auth-session.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MenuComponent],
})
export class MenuComponent implements OnInit, OnChanges {

  @Input() isOpen!: boolean;
  @Input() contentId!: string;
  
  public user: any;
  public appVersion!: string;
  public menuItemsItems = menuItems;

  constructor(
    private router: Router,
    //private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private localStore: LocalStorageService,
    private _authSession: AuthSessionService,
  ) { 
    addIcons({ chevronForward, personOutline, cashOutline, lockClosedOutline, shieldCheckmarkOutline, shieldOutline, trashOutline, logOutOutline });
  }

  ngOnInit() {
    this.getUserData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getUserData();
  }

  ionViewDidEnter() {
    this.getUserData();
  }

  public async gotTo(item: any){    
    if(item?.route) {
      this.router.navigate([item.route]); 
    }

    if(item?.externalRoute) {
      await Browser.open({ url: item.externalRoute });
    }
  }

  private getUserData() {
    const userData = this._authSession.getCurrentUser();
    if(userData) {
      this.user = userData;
    }
  }

}
