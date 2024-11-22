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
  
  public selectedOption!: ISelectOption;
  public isFormValid: boolean = false;

  constructor(
    private _modalCtrl: ModalController,
  ) { 
    addIcons({ chevronDownOutline, checkmarkOutline, addOutline  });
  }

  ngOnInit() {}

  onButtonClick() {
    this.buttonClick ? this.buttonClick() : null;
  }

  onRadioChange(event: any) {
    this.selectedOption = event.detail.value;
    this.isFormValid = !!this.selectedOption;
    console.log("Form valid: ", this.isFormValid)
  }

  dismiss() {
    this._modalCtrl.dismiss();
  }

  public saveSelection() {
    this._modalCtrl.dismiss(this.selectedOption);
  }

}

