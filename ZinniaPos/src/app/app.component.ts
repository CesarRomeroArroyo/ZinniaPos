import { Component } from '@angular/core';
import { LocalDataBaseService } from './services/local-data-base.service';
import { Store } from '@ngrx/store';
import { AppStore } from 'src/app/store/app.reducers';
import * as fromProfilesActions from './store/actions/profiles.action';
import { ProfileModel } from './models/profileModel';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ZinniaPos';
  constructor(
    private service: LocalDataBaseService,
    private store: Store<AppStore>
  ) {
    this.store.dispatch(new fromProfilesActions.ListProfiles(new ProfileModel()));
  }
}
