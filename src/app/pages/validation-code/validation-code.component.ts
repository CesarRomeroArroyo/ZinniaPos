import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import {NumpadComponent} from "./components/numpad/numpad.component";
import { CommonModule } from "@angular/common";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/bussiness/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/core/services/utils/loading.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { IEmailVerifyResponse } from 'src/app/core/interfaces/bussiness/verify.interface';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { LocalStorageService } from 'src/app/core/services/utils/local-storage.service';
import { StorageKeys } from 'src/app/core/consts/enums/storage-keys.enum';

@Component({
    selector: 'app-validation-code',
    templateUrl: './validation-code.component.html',
    styleUrls: ['./validation-code.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        NumpadComponent,
        ReactiveFormsModule,
    ]
})
export class ValidationCodeComponent implements OnInit {

    public code: string[] = [];
    public email!: string;
    public userId!: string;
    public timer: number = 30;
    public timerIntervalId!: any;
    public activationForm!: FormGroup;
    public isSendingCode: boolean = false;
    public feedback: string = "Enviando código al correo...";
    public characters: string[] = new Array(4).fill(undefined);

    private password!: string;

    constructor(
        private _router: Router,
        private _navCtrl: NavController,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _alertService: AlertService,
        private _toastService: ToastService,
        private _loadingService: LoadingService,
        private _localStorageService: LocalStorageService,
    ) { }

    ngOnInit() {
        this.buildForm();
        this.getData();
    }

    ngOnDestroy(): void {
        clearInterval(this.timerIntervalId);
    }

    public goBack() {
        this._navCtrl.back();
    }

    public resendActivationCode() {
        if(this.timer !== 0 || this.isSendingCode) return;
        this.feedback = "Enviando código al correo...";
        this.isSendingCode = true;
        this.sendActivationCode();
    }

    public onDigitReceived(digit: number) {
        const nextControl = Object.keys(this.activationForm.controls).find(control => {
            return this.activationForm.get(control)?.invalid;
        });
        if (nextControl) {
            this.activationForm.get(nextControl)?.setValue(digit.toString());
        }
    }

    public onDigitRemoved() {
        const controls = Object.keys(this.activationForm.controls);
        const lastFilledPosition = controls.reverse().findIndex(
            (key) => !!this.activationForm.get(key)?.value
        );

        if (lastFilledPosition !== -1) {
            const lastFilledControlName = `field${controls.length - lastFilledPosition}`;
            this.activationForm.get(lastFilledControlName)?.setValue("");
        }
    }

    public buildForm() {
        this.activationForm = this._formBuilder.group({
            field1: ["", [Validators.required]],
            field2: ["", [Validators.required]],
            field3: ["", [Validators.required]],
            field4: ["", [Validators.required]],
        });
    }

    public async verifyCode() {
        const code = Object.values(this.activationForm.value).join('');
        await this._loadingService.showLoading("Verificando código...");
        this._authService.verifyEmail(this.email).subscribe({
            next: async (response) => {
                await this._loadingService.hideLoading();
                if(response.length) {
                    if(code === response[0].activacion) {
                        await this.updateUser(response[0]);
                    }else {
                        await this._alertService.presentAlert("Código no valido", "El código ingresado no coincide");
                    }
                }else {
                    this._toastService.showToast({ message: "No se encontraron datos del usuario.", color: "danger"});
                }
            },
            error: async (error) => {
                await this._loadingService.hideLoading();
                this._toastService.showToast({ message: 'Lo sentimos, ha ocurrido un error inesperado.', duration: 1500, position: 'bottom', color: "danger"});
                console.error(error);
            }
        });

    }

    private goToOnboarding() {
        this._navCtrl.navigateForward('/onboarding');
    }

    private getData() {
        const nav = this._router.getCurrentNavigation();
        const state = nav?.extras.state;
        if (state) {
            this.email = state['email'];
            this.password = state['password'];
            this.userId = state['id'];
            this.sendActivationCode();
        }
    }

    private async updateUser(userData: any) {
        await this._loadingService.showLoading("Actualizando datos...");
        userData.estado = "1";
        userData.password = this.password;
         this._authService.updateUserWithoutToken(userData).subscribe({
            next: async (response) => {
                if (response) {
                    await this._loadingService.hideLoading();
                    this.goToOnboarding();
                } else {
                    this._toastService.showToast({ message: 'Lo sentimos, no se lograron actualizar los datos del usuario', duration: 1500, position: 'bottom', color: "danger"});
                    throw new Error("No se pudo actualizar el usuario");
                }
            },
            error: (error) => {
                console.error("Error actualizando usuario:", error);
                this._toastService.showToast({ message: 'Lo sentimos, no se lograron actualizar los datos del usuario', duration: 1500, position: 'bottom', color: "danger"});
            }
        });
    }

    private async sendActivationCode() {
        this._authService.sendActivationCode(this.userId).subscribe({
            next: (response) => {
                if(response) {
                    this.isSendingCode = false;
                    this.feedback = "Reenviar código en: ";
                    this.startTimer();
                }else {
                    this.isSendingCode = false;
                }   
            },
            error: (error) => {
                this.isSendingCode = false;
                console.error('Error al enviar el código:', error);
            }   
        });
    }

    private async saveUserSettings() {
        const registeredData = await this._localStorageService.getItem(StorageKeys.REGISTRATION_FORM) || [];        
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
