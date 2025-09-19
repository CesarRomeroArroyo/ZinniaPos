import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from '../menu/menu.component';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { AuthSessionService } from 'src/app/core/services/utils/auth-session.service';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
  standalone: true,
  imports: [IonicModule, MenuComponent],
})
export class MenuHeaderComponent implements OnInit, OnChanges {

  @Input() title!: string;

  isMenuOpen: boolean = false;

  constructor(
    private _authSession: AuthSessionService,
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    this.getCompanyName();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getCompanyName();
  }

  ionViewDidEnter() {
    this.getCompanyName();
  }

  menuWillOpen() {
    console.log('abriendo menu');
    this.isMenuOpen = true;
  }

  menuDidClose() {
    console.log('cerrando menu');
    this.isMenuOpen = false;
  }

  private getCompanyName() {
    const companyData = this._authSession.getUserCompany();
    if(companyData && !this.title) {
      this.title = companyData.name;
    }
  }

}
