import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProxyService } from 'src/app/core/services/proxy.service';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  public data: any;
  public columns: Array<any> = [];
  constructor(
    public translationService: TranslationService,
    private proxyService: ProxyService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getItems();

  }

  async getItems(){
    this.data = await this.proxyService.getMethod("list/items/")
  }

  goTo(url:any){
    this.router.navigate(url);
  }

}
