import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class MenuHeaderComponent implements OnInit {

  @Input() settingHeader = { title: 'Tienda Central'};
  constructor() { }

  ngOnInit() {}

}
