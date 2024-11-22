import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, trash } from 'ionicons/icons';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { consultationTypeConfig, serviceDaysConfig, settingHeader } from './bussiness-hours';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { UpsertAppointmentTypeComponent } from '../upsert-appointment-type/upsert-appointment-type.component';
import { OpenSelectOptionsService } from 'src/app/core/services/utils/open-select-options.service';

@Component({
  selector: 'app-business-hours',
  templateUrl: './business-hours.component.html',
  styleUrls: ['./business-hours.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    DirectivesModule,
    ReactiveFormsModule,
    CustomInputComponent
  ],
})
export class BusinessHoursComponent implements OnInit {

  public settingHeader = settingHeader;
  public typeAppointmentsForm!: FormGroup;
  public daysOfServiceForm!: FormGroup;

  constructor(
    private _modalCtrl: ModalController,
    private _formBuilder: FormBuilder,
    private _openSelectOptionsService: OpenSelectOptionsService,
  ) {
    addIcons({ trash, chevronForwardOutline });
    this.buildConsultationForm();
    this.buildDaysOfServiceForm();
   }

  ngOnInit() {}

  async selectAppointmentType() {
    const data = await this._openSelectOptionsService.open({
      ...consultationTypeConfig,
      buttonClick: this.goToUpsertAppointmentType.bind(this),
    });

    if (data) {
      this.typeAppointmentsForm.get('consultationType')?.setValue(data.value);
    }
  }

  async selectServiceDays() {
    const data = await this._openSelectOptionsService.open({
      ...serviceDaysConfig
    });

    if (data) {
      this.daysOfServiceForm.get('daysOfService')?.setValue(data.value);
    }
  }

  async goToUpsertAppointmentType() {
    const modal = await this._modalCtrl.create({
      component: UpsertAppointmentTypeComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }

  public actionCompleted() {
    const data = { completed: true };
    this._modalCtrl.dismiss(data);
  }

  private buildConsultationForm(): void {
    this.typeAppointmentsForm = this._formBuilder.group({
      appointmentType: ['', Validators.required]
    });
  }

  private buildDaysOfServiceForm(): void {
    this.daysOfServiceForm = this._formBuilder.group({
      daysOfService: ['', Validators.required]
    });
  }

}
