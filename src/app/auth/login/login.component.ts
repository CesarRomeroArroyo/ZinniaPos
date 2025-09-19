import { addIcons } from 'ionicons';
import { LoginImages } from './login.consts';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { AuthSessionService } from 'src/app/core/services/utils/auth-session.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { LoadingService } from 'src/app/core/services/utils/loading.service';

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
    IonicModule,
    ReactiveFormsModule,
    DirectivesModule,
    RouterModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent {

  public loginImages = LoginImages
  public loginForm!: FormGroup;

  constructor(
    private router: Router,
    private _formBuild: FormBuilder,
    private _toastService: ToastService,
    private _loadingService: LoadingService,
    private _authSessionService: AuthSessionService,
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    //this.validateRememberSession();
  }

  public async login() {
    if(this.loginForm.invalid) return;
    await this._loadingService.showLoading("Iniciando sesión...");
    const formValue = this.loginForm.value;

    this._authSessionService.login(formValue).subscribe({
      next: async(response) => {
        await this._loadingService.hideLoading();
        this.router.navigate(['/dashboard/']);
      },
      error: (err) => {
        this._loadingService.hideLoading();
        console.error(err);
        this._toastService.showToast({ message: "Ha ocurrido un error desconocido al iniciar sesion. Intentalo nuevamente", color: "danger"});
      }
    });

  }

}
