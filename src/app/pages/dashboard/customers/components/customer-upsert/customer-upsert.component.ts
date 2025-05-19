import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { settingHeader } from './customer-upsert.consts';
import { CustomersService } from 'src/app/core/services/bussiness/customers.service';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-customer-upsert',
  templateUrl: './customer-upsert.component.html',
  styleUrls: ['./customer-upsert.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomerUpsertComponent {

  public settingHeader = settingHeader;
  public customerUpsertForm!: FormGroup;
  
  constructor(
    private _formBuild: FormBuilder,
    private _modalCtrl: ModalController,
    private _customerService: CustomersService,
  ) {

  }

  ionViewWillEnter() {
    this.createForm();
  }

  public async saveCustomer() {
    const newCustomer = this.customerUpsertForm.value;
    this._customerService.saveCustomer(newCustomer).subscribe({
      next: (response) => {
        if(response === true) {
          console.log("registro exitoso");
          this._modalCtrl.dismiss({completed: true});
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private createForm(): void {
    this.customerUpsertForm = this._formBuild.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

}
