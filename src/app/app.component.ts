import { Component } from '@angular/core';
import { TranslationService } from './core/services/translation.service';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LaunchNavigator } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { MenuComponent } from './shared/components/menu/menu.component';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp, 
    IonRouterOutlet,
    CommonModule,
    MenuComponent
  ],
  providers: [
    StatusBar,
    LaunchNavigator
  ]
})
export class AppComponent {

  isMenuOpen: boolean = false;
  showTab: boolean = false;

  constructor(
    private translationService: TranslationService,
  ) {
    addIcons({ arrowBack });
    //this.translationService.init();
  }

  menuWillOpen() {
    this.isMenuOpen = true;
  }

  menuDidClose() {
    this.isMenuOpen = false;
  }

}
