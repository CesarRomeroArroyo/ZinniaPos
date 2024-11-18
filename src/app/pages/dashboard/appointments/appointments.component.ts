import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { MenuHeaderComponent } from 'src/app/shared/components/menu-header/menu-header.component';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    MenuHeaderComponent
  ]
})
export class AppointmentsComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
