import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
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

  public loading = true;
  public typeAppointmentsForm!: FormGroup;
  public dateForm!: FormGroup;
  private _appointmentTypes: IAppointmentType[] = [];
  private consultationTypeConfig: ISelectModalConfig = consultationTypeConfig;
  
  constructor(
    private _formBuilder: FormBuilder,
    private _modalCtrl: ModalController,
    private _appointmentTypesService: AppointmentTypeService,
    private _openSelectOptionsService: OpenSelectOptionsService,
  ) {
    addIcons({
      chevronForwardOutline,
    });
    this.buildTypeAppointmentsForm();
    this.buildDateForm();
  }

  ngOnInit() {
    this.getAppointmentTypes();
  }

  public getAppointmentTypeLabel(): string {
    const value = this.typeAppointmentsForm.get('appointmentType')?.value;
    const option = this._appointmentTypes.find(opt => opt.id === value);
    return option?.name || '';
  }

  public async selectAppointmentType() {
    const data = await this._openSelectOptionsService.open({ ...this.consultationTypeConfig });
  
    if (data) {
      this.typeAppointmentsForm.get('appointmentType')?.setValue(data.value);
    }
  }

  private buildTypeAppointmentsForm() {
    this.typeAppointmentsForm = this._formBuilder.group({
      appointmentType: ['', Validators.required],
    });
  }

  private buildDateForm() {
    this.dateForm = this._formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  private getAppointmentTypes() {
    this._appointmentTypesService.getAppointmentTypes("2808").subscribe({
      next: (response) => {
        this._appointmentTypes = response;
        this.consultationTypeConfig.optionsList = mapObjectToSelectOptions(response);
        this.loading = false; 
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
