import { Component } from '@angular/core';
import { TranslationService } from './core/services/translation.service';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LaunchNavigator } from '@awesome-cordova-plugins/launch-navigator/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp, 
    IonRouterOutlet,
    CommonModule
  ],
  providers: [
    StatusBar,
    LaunchNavigator
  ]
})
export class AppComponent {
  constructor(
    private translationService: TranslationService,
  ) {
    //this.translationService.init();
  }
}
