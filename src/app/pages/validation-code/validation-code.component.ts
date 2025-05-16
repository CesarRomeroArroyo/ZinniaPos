import { Component, OnInit } from '@angular/core';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import {NumpadComponent} from "./components/numpad/numpad.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'app-validation-code',
    templateUrl: './validation-code.component.html',
    styleUrls: ['./validation-code.component.scss'],
    standalone: true,
    imports: [
        IonHeader,
        IonContent,
        IonToolbar,
        IonButtons,
        IonButton,
        IonIcon,
        NumpadComponent,
        NgForOf,
        NgIf
    ]
})
export class ValidationCodeComponent implements OnInit {

    constructor(private navCtrl: NavController) {}

    ngOnInit() {}

    goBack() {
        this.navCtrl.back();
    }

    code: string[] = [];

    onDigitReceived(digit: number) {
        if (this.code.length < 4) {
            this.code.push(digit.toString());

            // Si ya hay 4 dígitos, puedes validar o redirigir
            if (this.code.length === 4) {
                console.log('Código completo:', this.code.join(''));
            }
        }
    }

    onDigitRemoved() {
        this.code.pop();
    }

    goToOnboarding() {
        this.navCtrl.navigateForward('/onboarding');
    }

}
