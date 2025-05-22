import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BusinessCategoryId } from 'src/app/core/consts/enums/business/business-category.enum';
import { ICompany } from 'src/app/core/interfaces/bussiness/company.interface';
import { AuthService } from 'src/app/core/services/bussiness/auth.service';
import { CompanyService } from 'src/app/core/services/bussiness/company.service';
import { AuthSessionService } from 'src/app/core/services/utils/auth-session.service';
import { MenuHeaderComponent } from 'src/app/shared/components/menu-header/menu-header.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MenuHeaderComponent,
  ]
})
export class DashboardComponent implements OnInit {

  constructor(
    private _router: Router,
    private _authSessionService: AuthSessionService,
  ) { }

  async ngOnInit() {
    const user = this._authSessionService.getCurrentUser();

    if (!user) {
      this._router.navigate(['/login']);
      return;
    }
  }

}
