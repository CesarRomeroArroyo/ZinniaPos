import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProxyService } from 'src/app/core/services/proxy.service';
import { TranslationService } from 'src/app/core/services/translation.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  public data: any;
  public columns: Array<any> = [];
  constructor(
    public translationService: TranslationService,
    private proxyService: ProxyService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  goTo(url:any){
    this.router.navigate(url);
  }
}
