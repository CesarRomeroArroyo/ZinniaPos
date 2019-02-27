import { Component } from '@angular/core';
import { LocalDataBaseService } from './services/local-data-base.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ZinniaPos';
  constructor(private service: LocalDataBaseService) {}
}
