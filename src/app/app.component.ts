import { Component } from '@angular/core';
import { TranslationService } from './core/services/translation.service';
import { IonApp, IonContent, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { CommonModule } from '@angular/common';
import { LaunchNavigator } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { MenuComponent } from './shared/components/menu/menu.component';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { MenuFooterComponent } from './shared/components/menu-footer/menu-footer.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp, 
    IonLabel,
    IonRouterOutlet,
    CommonModule,
    MenuComponent,
    IonContent,
    MenuFooterComponent,
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
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private translationService: TranslationService,
  ) {
    addIcons({ arrowBack });
    this.updateShowTabFromRoute();
    //this.translationService.init();
  }

  menuWillOpen() {
    this.isMenuOpen = true;
  }

  menuDidClose() {
    this.isMenuOpen = false;
  }

  private updateShowTabFromRoute(): void { 
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let route = this._activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        this.showTab = route.snapshot.data['showTab'] ?? false;
      }
    });
  }

}
