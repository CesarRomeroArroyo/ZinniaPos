import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack, checkmarkOutline, closeOutline } from 'ionicons/icons'
import { ActionHeaderMap, Iheader, InferfaceHeader } from 'src/app/core/interfaces/header.interface';
import { NavController } from '@ionic/angular';
import { iconMap } from './header.consts'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HeaderComponent {

  @Input() settingHeader: Iheader = { title: 'add-title', interface: 'nav'};
  @Input() customActionCompleted?: () => void;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {
    addIcons({ arrowBack, closeOutline, checkmarkOutline });
  }

  public getBackIcon(): string {
    return iconMap[this.settingHeader.interface as InferfaceHeader] || 'arrow-back';
  }

  public onBack() {
    const actions: Partial<ActionHeaderMap> = {
      nav: () => this.navCtrl.back(),
      modal: () => this.modalCtrl.dismiss()
    };
    const action = actions[this.settingHeader.interface as InferfaceHeader];
    action ? action() : console.warn('Tipo de interfaz desconocido...');
  }

  public actionCompleted() {
    if (this.customActionCompleted) {
      this.customActionCompleted(); 
    }
  }

  public enableCompletedButtom(): boolean {
    return !!this.customActionCompleted && this.settingHeader.interface == 'modal';
  }

}
