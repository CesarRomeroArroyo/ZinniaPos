import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageKeys } from 'src/app/core/consts/enums/storage-keys.enum';
import { LocalStorageService } from 'src/app/core/services/utils/storage/local-storage.service';
import { footerMenu } from './menu-footer.consts';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, homeOutline, personOutline, settingsOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-menu-footer',
  templateUrl: './menu-footer.component.html',
  styleUrls: ['./menu-footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
})
export class MenuFooterComponent implements OnInit {

  public userLogged: any;
  public tabSelected = 'home';
  public menu = footerMenu;
  public activeTab!: string;

  constructor(
    private _router: Router,
    private _localStorageService: LocalStorageService,
  ) { 
    addIcons({
      homeOutline,
      timeOutline,
      personOutline,
      calendarOutline,
      settingsOutline,
    });
  }

  ngOnInit(): void {
    this.getUserData();
    this.activeTab = this._router.url; 
  }

  getIsActive(url: string): boolean {
    return this.activeTab.includes(url);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.goTo(tab);
  }

  goTo(path: string) {
    this._router.navigate([path]);
    this.activeTab = path;
  }

  private async getUserData() {
    
    this.menu = footerMenu.filter( item => item.permissions.includes("1"));
  }

}
