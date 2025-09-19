import { Component, OnInit } from '@angular/core';
import {IonButton, IonContent, IonFooter} from "@ionic/angular/standalone";
import {NgOptimizedImage} from "@angular/common";
import { MenuHeaderComponent } from 'src/app/shared/components/menu-header/menu-header.component';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onbording.component.html',
  styleUrls: ['./onbording.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    NgOptimizedImage,
    IonButton,
    IonFooter,
    MenuHeaderComponent,
  ]
})
export class OnbordingComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
