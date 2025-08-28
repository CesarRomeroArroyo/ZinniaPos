import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { settingHeader } from './product-customer.consts';

// Servicio de clientes (ajusta la ruta si difiere en tu proyecto)
import { CustomersService } from 'src/app/core/services/bussiness/customers.service';

@Component({
  selector: 'app-product-customer',
  standalone: true,
  templateUrl: './product-customer.component.html',
  styleUrls: ['./product-customer.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
})
export class ProductCustomerComponent {
  public settingHeader = settingHeader;
  public customerForm!: FormGroup;
  public saving = false;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private customersService: CustomersService,
  ) {}

  ionViewWillEnter() {
    this.buildForm();
  }

  private buildForm(): void {
    this.customerForm = this.fb.group({
      name:    ['', [Validators.required, Validators.minLength(2)]],
      email:   ['', [Validators.required, Validators.email]],
      phone:   ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
  }

  public onSubmit(): void {
    if (!this.customerForm || this.customerForm.invalid || this.saving) return;

    this.saving = true;
    const payload = this.customerForm.value;

    this.customersService.saveCustomer(payload).subscribe({
      next: (ok: boolean) => {
        this.saving = false;
        if (ok) {
          this.modalCtrl.dismiss({ completed: true, customer: payload });
        }
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
      },
    });
  }
}
