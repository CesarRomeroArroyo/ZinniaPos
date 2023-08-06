import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit {
  public data: any;
  public columns: Array<any> = [];
  constructor(
    public translationService: TranslationService,) { }

  ngOnInit() {
  }


}
