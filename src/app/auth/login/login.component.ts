import { addIcons } from 'ionicons';
import { LoginImages } from './login.consts';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProxyService } from '../../core/services/proxy.service';
import { TranslationService } from '../../core/services/translation.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonCheckbox, IonContent, IonFooter, IonInput, IonToolbar, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  providers: [
    ModalController
  ],
  imports: [
    CommonModule,
    IonInput,
    IonCheckbox,
    IonButton,
    IonFooter,
    IonToolbar,
    IonContent,
    ReactiveFormsModule,
    //DirectivesModule,
    RouterModule,
    FormsModule
  ]
})
export class LoginComponent {
  public usuario:any =  {user: '', pass:''};
  public loginImages = LoginImages
  public loginForm!: FormGroup;

  constructor(
    public translationService: TranslationService,
    private proxy:ProxyService,
    private localStorage: LocalStorageService,
    private toastController: ToastController,
    private router: Router,
    private _formBuild: FormBuilder,
  ) { 
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  ionViewWillEnter() {
    this.createForm();
  }

  get isDevelopment() {
    return !environment.production;
  }

  private createForm(): void {
    this.loginForm = this._formBuild.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    //this.validateRememberSession();
  }

  async login(){
      const user: any = await this.proxy.postMethod('login/', this.usuario);
    console.log(user);
    if(user.length > 0){
      this.localStorage.setItem('ZINNIA_USER', user[0]);
      const toast = await this.toastController.create({
        message: 'Bienvenido '+user[0].name,
        duration: 3000,
        color: 'success'
      });
      toast.present();
      this.router.navigate(['inicio']);
    }
    else {
      const toast = await this.toastController.create({
        message: 'Usuario o Password Incorrecto',
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
