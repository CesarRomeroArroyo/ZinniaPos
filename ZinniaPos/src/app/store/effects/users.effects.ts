import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import * as fromUsersActions from '../actions/users.action';
import { LocalDataBaseService } from 'src/app/services/local-data-base.service';
import { DatabaseTablesEnum } from 'src/app/emuns/data-bases-tablesEnum';
import { userModel } from 'src/app/models/userModel';
import * as fromUserAction from 'src/app/store/actions/users.action';


@Injectable()
export class UsersEffects {
    constructor(
        private serviceData: LocalDataBaseService,
        private actions$: Actions
    ) {}

    @Effect() 
    getUsers$ = this.actions$.pipe(
        ofType(fromUsersActions.UsersActionTypes.LIST_USERS),
        switchMap((action: fromUsersActions.ListUsers ) => {
            return this.serviceData.getAll(DatabaseTablesEnum.Users).then((data: userModel[]) => {
                return new fromUsersActions.ListUsersSuccess(data);
            });
        })
    );

    @Effect() 
    saveUsers$ = this.actions$.pipe(
        ofType(fromUsersActions.UsersActionTypes.ADD_USER),
        switchMap((action: fromUsersActions.AddUser ) => {
           return this.serviceData.add(DatabaseTablesEnum.Users, action.payload)
            .then(() => {
                return new fromUsersActions.ListUsers(action.payload);
            })
            .catch((err) => {
                return new fromUsersActions.ListUsers(action.payload);
            });
        })
    );

    @Effect() 
    updateUsers$ = this.actions$.pipe(
        ofType(fromUsersActions.UsersActionTypes.UPDATE_USER),
        switchMap((action: fromUsersActions.UpdateUser ) => {
           return this.serviceData.uptade(DatabaseTablesEnum.Users, action.payload)
            .then(() => {
                return new fromUsersActions.ListUsers(action.payload);
            })
            .catch((err) => {
                return new fromUsersActions.ListUsers(action.payload);
            });
        })
    );
}