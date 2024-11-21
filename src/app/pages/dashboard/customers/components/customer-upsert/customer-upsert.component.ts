import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { settingHeader } from './customer-upsert.consts';

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
  ) { }

  ionViewWillEnter() {
    this.createForm();
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
