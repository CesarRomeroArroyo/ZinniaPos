import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../core/services/local-storage.service';
import { TranslationService } from '../core/services/translation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    private router: Router,
    public translationService: TranslationService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {
  }

  gotTo(ruta:any){
    this.router.navigate(ruta)
  }

  logout(){
    this.localStorage.clearToken();
    this.router.navigate(['login']);
    //document.location = "https://appdomi.amazing-wright.137-184-198-32.plesk.page/";
  }
}
