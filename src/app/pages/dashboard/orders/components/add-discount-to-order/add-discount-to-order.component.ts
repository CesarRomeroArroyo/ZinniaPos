import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { discountTypeSelectionOptions } from '../../../discount/discount.consts';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { addOutline, chevronForwardOutline, removeOutline } from 'ionicons/icons';
import { discountTypeOptionsConfig, settingHeader } from './add-discount.consts';
import { ModalController } from '@ionic/angular/standalone';
import { OpenSelectOptionsService } from 'src/app/core/services/utils/open-select-options.service';

@Component({
  selector: 'app-add-discount-to-order',
  templateUrl: './add-discount-to-order.component.html',
  styleUrls: ['./add-discount-to-order.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    DirectivesModule,
    ReactiveFormsModule,
    CustomInputComponent
  ]
})
export class AddDiscountToOrderComponent implements OnInit {

  public discountForm!: FormGroup;
  public settingHeader = settingHeader;
  
  constructor(
    private _formBuilder: FormBuilder,
    private _modalCtrl: ModalController,
    private _openSelectOptionsService: OpenSelectOptionsService,
  ) {
    addIcons({
      addOutline,
      removeOutline,
      chevronForwardOutline
    });
    this.buildDiscountForm();
  }

  ngOnInit() {}

  public increaseInputValue() {
    const control = this.discountForm.get('value');
    const currentValue = Number(control?.value) || 0;
    control?.setValue(currentValue + 1);
  }

  public decreaseInputValue() {
    const control = this.discountForm.get('value');
    const currentValue = Number(control?.value) || 0;
    if (currentValue > 0) {
      control?.setValue(currentValue - 1);
    }
  }

  public actionCompleted() {
    const data = this.discountForm.value;
    this._modalCtrl.dismiss(data);
  }

  public getDiscountTypeLabel(): string {
    const value = this.discountForm.get('type')?.value;
    const option = discountTypeSelectionOptions.find(opt => opt.value === value);
    return option?.title || '';
  }

  public async selectDiscountType() {
    const data = await this._openSelectOptionsService.open({ ...discountTypeOptionsConfig });
    if (data) {
      this.discountForm.get('type')?.setValue(data.value);
    }
  }

  private buildDiscountForm() {
    this.discountForm = this._formBuilder.group({
      type: ['', Validators.required],
      value: [0, Validators.required],
      resaon: ['']
    });
  }



}
