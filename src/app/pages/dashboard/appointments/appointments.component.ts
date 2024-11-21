import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/core/services/utils/local-storage.service';
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
  ],
  providers: [
    ModalController
  ]
})
export class AppointmentsComponent implements OnInit {

  public selectedSegment = '';

  constructor(
    private _router: Router,
    private _localStorage: LocalStorageService,
    private _modalCtrl: ModalController,
  ) { }

  ngOnInit(): void {
    this.selectedSegment = this._router.url;
  }

  ionViewWillEnter() {
    this.selectedSegment = this._router.url;
  }

}
