import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StepData } from 'src/app/core/consts/types/steps.type';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageService } from 'src/app/core/services/utils/storage/local-storage.service';
import { StorageKeys } from 'src/app/core/consts/enums/storage-keys.enum';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business-account-info',
  templateUrl: './business-account-info.component.html',
  styleUrls: ['./business-account-info.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class BusinessAccountInfoComponent implements OnInit {

  @Output() handleStepData: EventEmitter<StepData> = new EventEmitter();
  @Output() formValidity: EventEmitter<boolean> = new EventEmitter();

  public businessAccountForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  public emitData() {
    const data: StepData = { step: 2, data: this.businessAccountForm.value };
    this.handleStepData.emit(data);
  }

  private async buildForm() {
    this.businessAccountForm = this._formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ruc: ['', [Validators.required]],
    });
  
    this.formValidity.emit(this.businessAccountForm.valid);

    this.businessAccountForm.statusChanges.subscribe(() => {
      this.formValidity.emit(this.businessAccountForm.valid);
    });
  
    const savedSteps = await this._localStorageService.getItem(StorageKeys.REGISTRATION_FORM);
    const currentStepData = savedSteps?.find((s: StepData) => s.step === 2);
    if (currentStepData) {
      this.businessAccountForm.patchValue(currentStepData.data);
    }
  }

}
