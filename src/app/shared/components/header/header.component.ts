import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons'
import { Iheader } from 'src/app/core/interfaces/header.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  @Input() settingHeader: Iheader = { title: 'add-title', modalBack: false, viewBtnBack: false };

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {
    addIcons({
      arrowBack
    });
  }

  public onBackModal() {
    this.modalCtrl.dismiss();
  }

  public onBack() {
    this.navCtrl.back();
  }

}
