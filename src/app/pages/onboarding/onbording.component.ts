import { Component, OnInit } from '@angular/core';
import {IonButton, IonContent, IonFooter} from "@ionic/angular/standalone";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-onboarding',
  templateUrl: './onbording.component.html',
  styleUrls: ['./onbording.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    NgOptimizedImage,
    IonButton,
      IonFooter
  ]
})
export class OnbordingComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
