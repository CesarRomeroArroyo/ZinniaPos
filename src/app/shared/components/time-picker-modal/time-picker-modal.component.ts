import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkOutline, chevronDownOutline } from 'ionicons/icons';

@Component({
  selector: 'app-time-picker-modal',
  templateUrl: './time-picker-modal.component.html',
  styleUrls: ['./time-picker-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ],
})
export class TimePickerModalComponent {

  @Input() value!: string;
  public selectedTime!: string;

  constructor(
    private modalCtrl: ModalController
  ) { 
    addIcons({
      chevronDownOutline,
      checkmarkOutline,
    });
    this.selectedTime = this.value || '08:00';
  }

  public confirm() {
    this.modalCtrl.dismiss({ time: this.selectedTime }, 'confirm');
  }

  public cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  public onTimeChange(value: string | string[] | null | undefined) {
    if (typeof value === 'string') {
      this.selectedTime = value;
    } else if (Array.isArray(value) && typeof value[0] === 'string') {
      this.selectedTime = value[0];
    } else {
      this.selectedTime = '08:00'; // valor por defecto
    }
  }

}
