import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LocalDataBaseService } from 'src/app/services/local-data-base.service';
import * as fromProfilesActions from '../actions/profiles.action';
import { ProfileModel } from '../../models/profileModel';
import { switchMap } from 'rxjs/operators';
import { DatabaseTablesEnum } from 'src/app/emuns/data-bases-tablesEnum';


@Injectable()
export class ProfilesEffects {
    
    constructor(
        private serviceData: LocalDataBaseService,
        private actions$: Actions
    ) {}

    @Effect() 
    getProfiles$ = this.actions$.pipe(
        ofType(fromProfilesActions.ProfileActionTypes.LIST_PROFILES),
        switchMap((action: fromProfilesActions.ListProfiles ) => {
            return this.serviceData.getAll(DatabaseTablesEnum.Profiles).then((data: ProfileModel[]) => {
                return new fromProfilesActions.ListProfilesSuccess(data);
            });
        })
    );
}