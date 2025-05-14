import { Component, OnInit } from '@angular/core';
import {IonButton, IonInput} from "@ionic/angular/standalone";

@Component({
    selector: 'app-user-account-info',
    templateUrl: './user-account-info.component.html',
    styleUrls: ['./user-account-info.component.scss'],
    standalone: true,
    imports: [
        IonInput,
        IonButton
    ]
})
export class UserAccountInfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
