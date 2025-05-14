import { Component, OnInit } from '@angular/core';
import {CustomInputComponent} from "../../../../shared/components/custom-input/custom-input.component";
import { IonInput} from '@ionic/angular/standalone';

@Component({
  selector: 'app-business-account-info',
  templateUrl: './business-account-info.component.html',
  styleUrls: ['./business-account-info.component.scss'],
  standalone: true,
  imports: [
    CustomInputComponent,
    IonInput,
  ]
})
export class BusinessAccountInfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
