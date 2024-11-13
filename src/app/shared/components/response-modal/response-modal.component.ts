import { Component, Input } from '@angular/core';
import * as ionicons from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-response-modal',
  templateUrl: './response-modal.component.html',
  styleUrls: ['./response-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class ResponseModalComponent {

  @Input() isSuccess: boolean = true;
  @Input() firstIcon!: string;
  @Input() secondIcon!: string;
  @Input() title!: string;
  @Input() message!: string;
  @Input() buttonText!: string;

  constructor(private _modalCtrl: ModalController) { 
    addIcons(ionicons);
  }

  public closeModal() {
    this._modalCtrl.dismiss();
  }

}
