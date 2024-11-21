import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-appointments-main',
  templateUrl: './appointments-main.component.html',
  styleUrls: ['./appointments-main.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class AppointmentsMainComponent implements OnInit {

  constructor(
    private _router: Router,
  ) { }

  ngOnInit() {}

}
