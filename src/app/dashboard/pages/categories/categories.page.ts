import { Component, OnInit } from '@angular/core';
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
  ) { }

  ngOnInit() {
  }

}
