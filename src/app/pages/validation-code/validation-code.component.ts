import { Component, OnInit } from '@angular/core';
import {
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon
} from '@ionic/angular/standalone';
import { IonicModule, NavController } from '@ionic/angular';
import {NumpadComponent} from "./components/numpad/numpad.component";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/bussiness/auth.service';

@Component({
    selector: 'app-validation-code',
    templateUrl: './validation-code.component.html',
    styleUrls: ['./validation-code.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        NumpadComponent,
    ]
})
export class ValidationCodeComponent implements OnInit {

    public code: string[] = [];
    public email!: string;
    public userId!: string;
    public feedback: string = "Enviando código al correo...";
    public timer: number = 30;
    public timerIntervalId!: any;

    constructor(
        private _router: Router,
        private _navCtrl: NavController,
        private _authService: AuthService,
    ) {}

    ngOnInit() {
        this.getData();
    }

    ngOnDestroy(): void {
        clearInterval(this.timerIntervalId);
    }

    public goBack() {
        this._navCtrl.back();
    }

    public onDigitReceived(digit: number) {
        if (this.code.length < 4) {
            this.code.push(digit.toString());

            if (this.code.length === 4) {
                console.log('Código completo:', this.code.join(''));
            }
        }
    }

    public onDigitRemoved() {
        this.code.pop();
    }

    goToOnboarding() {
        this._navCtrl.navigateForward('/onboarding');
    }

    public resendActivationCode() {
        if(this.timer !== 0) return;
        this.sendActivationCode();
    }

    private getData() {
        const nav = this._router.getCurrentNavigation();
        const state = nav?.extras.state;
        if (state) {
            this.email = state['email'];
            this.userId = state['id'];
            this.sendActivationCode();
        }
    }

    private async sendActivationCode() {
        this._authService.sendActivationCode(this.userId).subscribe({
            next: (response) => {
                if(response) {
                    this.feedback = "Renviar código en: ";
                    this.startTimer();
                }
            }
        });
    }

    private startTimer(): void {
        this.timer = 30;
        this.timerIntervalId = setInterval(() => {
        this.timer--;
        if (this.timer <= 0) {
            this.feedback = "Reenviar código";
            clearInterval(this.timerIntervalId);
        }
    }, 1000);
}

}
