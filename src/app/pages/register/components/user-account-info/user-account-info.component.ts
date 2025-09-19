import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {IonButton, IonInput} from "@ionic/angular/standalone";
import { StorageKeys } from 'src/app/core/consts/enums/storage-keys.enum';
import { StepData } from 'src/app/core/consts/types/steps.type';
import { FormService } from 'src/app/core/services/utils/form.service';
import { LocalStorageService } from 'src/app/core/services/utils/storage/local-storage.service';

@Component({
    selector: 'app-user-account-info',
    templateUrl: './user-account-info.component.html',
    styleUrls: ['./user-account-info.component.scss'],
    standalone: true,
    imports: [
      IonicModule,
      CommonModule,
      ReactiveFormsModule
    ]
})
export class UserAccountInfoComponent implements OnInit {

  @Output() handleStepData: EventEmitter<StepData> = new EventEmitter();
  @Output() formValidity: EventEmitter<boolean> = new EventEmitter();
  
  public userAccountForm!: FormGroup;

  constructor(
    private _formService: FormService,
    private _formBuilder: FormBuilder,
    private _localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  public emitData() {
    const data: StepData = { step: 3, data: this.userAccountForm.value };
    this.handleStepData.emit(data);
  }

  private async buildForm() {
    this.userAccountForm = this._formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], [this._formService.emailNotTaken()]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required, this._formService.passwordsMatch]],
    });
    
    this.formValidity.emit(this.userAccountForm.valid);
  
    this.userAccountForm.statusChanges.subscribe(() => {
      this.formValidity.emit(this.userAccountForm.valid);
    });
    
    const savedSteps = await this._localStorageService.getItem(StorageKeys.REGISTRATION_FORM);
    const currentStepData = savedSteps?.find((s: StepData) => s.step === 3);
    if (currentStepData) {
      this.userAccountForm.patchValue(currentStepData.data);
    }
  }

}
