import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from '../menu/menu.component';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
  standalone: true,
  imports: [IonicModule, MenuComponent],
})
export class MenuHeaderComponent implements OnInit {

  @Input() settingHeader = { title: 'Tienda Central'};
  isMenuOpen: boolean = false;

  constructor() {
    addIcons({ arrowBack });
  }

  ngOnInit() {}

  menuWillOpen() {
    this.isMenuOpen = true;
  }

  menuDidClose() {
    this.isMenuOpen = false;
  }

}
