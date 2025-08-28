import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';

// usa la const renombrada para NO sobrescribir
import { upsertAppointmentHeader } from './upsert-appointment.consts';
import { Iheader } from 'src/app/core/interfaces/header.interface';

import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { OpenSelectOptionsService } from 'src/app/core/services/utils/open-select-options.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { consultationTypeConfig, mapObjectToSelectOptions } from '../../appointments.consts';
import { AppointmentTypeService } from 'src/app/core/services/bussiness/appointment-type.service';
import { ISelectModalConfig } from 'src/app/core/interfaces/select-options-modal.interface';
import { IAppointmentType } from 'src/app/core/interfaces/bussiness/appointments-type.interface';

@Component({
  selector: 'app-upsert-appointment',
  templateUrl: './upsert-appointment.component.html',
  styleUrls: ['./upsert-appointment.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    DirectivesModule,
    ReactiveFormsModule,
  ],
})
export class UpsertAppointmentComponent implements OnInit {
  // ✅ Ahora sí coincide EXACTAMENTE con Iheader
  public settingHeader: Iheader = upsertAppointmentHeader;

  public loading = true;
  public typeAppointmentsForm!: FormGroup;
  public dateForm!: FormGroup;

  private _appointmentTypes: IAppointmentType[] = [];
  private consultationTypeConfig: ISelectModalConfig = consultationTypeConfig;

  constructor(
    private _formBuilder: FormBuilder,
    private _modalCtrl: ModalController,
    private _alertCtrl: AlertController,
    private _appointmentTypesService: AppointmentTypeService,
    private _openSelectOptionsService: OpenSelectOptionsService,
  ) {
    addIcons({ chevronForwardOutline });
    this.buildTypeAppointmentsForm();
    this.buildDateForm();
  }

  ngOnInit() {
    this.getAppointmentTypes();
  }

  /** ====== Getters / labels ====== */
  public getAppointmentTypeLabel(): string {
    const value = this.typeAppointmentsForm.get('appointmentType')?.value;
    const option = this._appointmentTypes.find(opt => opt.id === value);
    return option?.name || '';
  }

  /** ====== Selectores (tipo / fecha / hora) ====== */
  public async selectAppointmentType() {
    const data = await this._openSelectOptionsService.open({ ...this.consultationTypeConfig });
    if (data) {
      this.typeAppointmentsForm.get('appointmentType')?.setValue(data.value);
    }
  }

  public async selectDate() {
    const alert = await this._alertCtrl.create({
      header: 'Selecciona fecha',
      inputs: [
        {
          name: 'date',
          type: 'date',
          value: this.dateForm.get('date')?.value || this.todayISO(),
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Aceptar',
          handler: ({ date }) => {
            if (date) this.dateForm.get('date')?.setValue(date);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  public async selectTime() {
    const alert = await this._alertCtrl.create({
      header: 'Selecciona hora',
      inputs: [
        {
          name: 'time',
          type: 'time',
          value: this.dateForm.get('time')?.value || '09:00',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Aceptar',
          handler: ({ time }) => {
            if (time) this.dateForm.get('time')?.setValue(time);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  /** ====== Forms ====== */
  private buildTypeAppointmentsForm() {
    this.typeAppointmentsForm = this._formBuilder.group({
      appointmentType: ['', Validators.required],
    });
  }

  private buildDateForm() {
    this.dateForm = this._formBuilder.group({
      date: ['', Validators.required],   // YYYY-MM-DD
      time: ['', Validators.required],   // HH:mm
    });
  }

  /** ====== Data ====== */
  private getAppointmentTypes() {
    this._appointmentTypesService.getAppointmentTypes('2808').subscribe({
      next: (response) => {
        this._appointmentTypes = response;
        this.consultationTypeConfig.optionsList = mapObjectToSelectOptions(response);
        this.loading = false;
      },
      error: (error) => console.error(error),
    });
  }

  /** ====== Confirmaciones / Header action ====== */
  public actionCompleted = () => this.confirmAppointment();

  public confirmAppointment() {
    if (this.typeAppointmentsForm.invalid || this.dateForm.invalid) {
      this.markAllAsTouched();
      return;
    }
    const payload = {
      typeId: this.typeAppointmentsForm.value.appointmentType,
      date: this.dateForm.value.date, // YYYY-MM-DD
      time: this.dateForm.value.time, // HH:mm
    };
    console.log('Confirmar cita →', payload);
    // this._modalCtrl.dismiss({ completed: true, appointment: payload });
  }

  /** ====== Utils ====== */
  private markAllAsTouched() {
    this.typeAppointmentsForm.markAllAsTouched();
    this.dateForm.markAllAsTouched();
  }

  private todayISO(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
