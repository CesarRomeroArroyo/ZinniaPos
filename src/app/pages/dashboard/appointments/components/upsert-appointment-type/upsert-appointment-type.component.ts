import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { settingHeader } from './upsert-appointment-type.consts';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-upsert-appointment-type',
  templateUrl: './upsert-appointment-type.component.html',
  styleUrls: ['./upsert-appointment-type.component.scss'],
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
export class UpsertAppointmentTypeComponent {

  public settingHeader = settingHeader;
  public typeAppointmentForm!: FormGroup;
  
  constructor(
    private _formBuild: FormBuilder,
    private _modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  public insertAppointmentType() {
    const payload = this.typeAppointmentForm.value;
    console.log("Appointment type created...", payload);
    this._modalCtrl.dismiss({ completed: true });
  }

  private createForm(): void {
    this.typeAppointmentForm = this._formBuild.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
}
