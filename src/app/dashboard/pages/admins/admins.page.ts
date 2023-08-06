import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.page.html',
  styleUrls: ['./admins.page.scss'],
})
export class AdminsPage implements OnInit {
  public data: any;
  public columns: Array<any> = [];
  constructor(
    public translationService: TranslationService,) { }

  ngOnInit() {
  }

}
