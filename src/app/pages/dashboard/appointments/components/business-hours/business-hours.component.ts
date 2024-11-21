import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, trash } from 'ionicons/icons';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { settingHeader, typesOfConsultation } from './bussiness-hours';
import { SelectOptionsModalComponent } from 'src/app/shared/components/select-options-modal/select-options-modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';

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
  public selectedOption!: string;

  public typeConsultationForm!: FormGroup;

  /* Campos-valores del formulario */
  public typeConsultationSelected!: string;


  constructor(
    private _modalCtrl: ModalController,
    private _formBuilder: FormBuilder,
  ) {
    addIcons({ trash, chevronForwardOutline });
    this.buildConsultationForm();
   }

  ngOnInit() {}

  onValueChanged(newValue: string | null): void {
    console.log('Nuevo valor:', newValue);
    this.typeConsultationForm.get('consultationType')?.setValue(newValue);
  }

  async openModal() {
    const modal = await this._modalCtrl.create({
      component: SelectOptionsModalComponent,
      componentProps: {
        title: 'Tipo de consulta',
        options: typesOfConsultation,
        actionButton: true,
        buttonClick: this.openUpsertTypeConsultation.bind(this), 
      },
      cssClass: 'option-select-modal',
      breakpoints: [0, 1],
      initialBreakpoint: 1, 
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      console.log(data);
      this.typeConsultationSelected = data;
    }
  }

  async openUpsertTypeConsultation() {
    console.log("Upsert new type consultation")
  }



  public actionCompleted() {
    console.log("cerrando modal");
    const data = { completed: true };
    this._modalCtrl.dismiss(data);
  }

  private buildConsultationForm(): void {
    this.typeConsultationForm = this._formBuilder.group({
      consultationType: ['', Validators.required]
    });
  }

}
