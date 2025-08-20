import {CustomInputComponent} from "../../../../shared/components/custom-input/custom-input.component";
import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { LocalStorageService } from "src/app/core/services/utils/storage/local-storage.service";
import { StorageKeys } from "src/app/core/consts/enums/storage-keys.enum";
import { StepData } from "src/app/core/consts/types/steps.type";
import { BusinessType } from "src/app/core/interfaces/bussiness/business-type.interface";
import { businessCategories } from "src/app/core/consts/values/business-category.consts";

@Component({
  selector: 'app-business-type',
  templateUrl: './business-type.component.html',
  styleUrls: ['./business-type.component.scss'],
  standalone: true,
  imports: [
    CustomInputComponent,
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class BusinessTypeComponent {

  @Output() handleStepData: EventEmitter<StepData> = new EventEmitter();
  @Output() formValidity: EventEmitter<boolean> = new EventEmitter();

  public businessTypeForm!: FormGroup;
  public businessCategories: BusinessType[] = businessCategories;

  constructor(
    private _formBuilder: FormBuilder,
    private _localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  get businessType(): FormControl {
    return this.businessTypeForm.get('businessType') as FormControl;
  }

  public emitData() {
    const data: StepData = { step: 1, data: this.businessTypeForm.value };
    this.handleStepData.emit(data);
  }

  private async buildForm() {
    this.businessTypeForm = this._formBuilder.group({
      businessType: ['', Validators.required],
    });

    this.formValidity.emit(this.businessTypeForm.valid);

    this.businessTypeForm.statusChanges.subscribe(() => {
      this.formValidity.emit(this.businessTypeForm.valid);
    });

    const savedSteps = await this._localStorageService.getItem(StorageKeys.REGISTRATION_FORM);
    const currentStepData = savedSteps?.find((s: StepData) => s.step === 1);
    if (currentStepData) {
      this.businessTypeForm.patchValue(currentStepData.data);
    }

  }


}
