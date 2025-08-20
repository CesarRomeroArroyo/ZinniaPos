import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkOutline, chevronDownOutline } from 'ionicons/icons';
import { ISelectOption } from 'src/app/core/interfaces/select-options-modal.interface';

@Component({
  selector: 'app-select-options-modal',
  templateUrl: './select-options-modal.component.html',
  styleUrls: ['./select-options-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectOptionsModalComponent implements OnInit {

  @Input() headerTitle: string = '';
  @Input() optionsList: ISelectOption[] = [];
  @Input() actionButton: boolean = true;
  @Input() buttonClick?: () => void;
  @Input() componentToOpen!: any;
  @Input() multiple: boolean = false;

  public selectedOption!: ISelectOption;
  public selectedOptions: ISelectOption[] = [];
  public isFormValid: boolean = false;

  constructor(
    private _modalCtrl: ModalController,
  ) { 
    addIcons({ chevronDownOutline, checkmarkOutline, addOutline  });
  }

  ngOnInit() {}

  public async onButtonClick() {
    if (this.componentToOpen) {
      const modal = await this._modalCtrl.create({
        component: this.componentToOpen
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
    } else {
      this.buttonClick ? this.buttonClick() : null;
    }
  }

  onRadioChange(event: any) {
    this.selectedOption = event.detail.value;
    this.isFormValid = !!this.selectedOption;
    console.log("Form valid: ", this.isFormValid)
  }

  onCheckboxChange() {
    this.selectedOptions = this.optionsList.filter(opt => opt.selected);
    this.isFormValid = this.selectedOptions.length > 0;
  }

  dismiss() {
    this._modalCtrl.dismiss();
  }

  public saveSelection() {
    if (this.multiple) {
      this._modalCtrl.dismiss(this.selectedOptions);
    } else {
      this._modalCtrl.dismiss(this.selectedOption);
    }
  }

}

