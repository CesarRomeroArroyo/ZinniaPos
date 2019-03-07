import { Action } from '@ngrx/store';
import { userModel } from 'src/app/models/userModel';


export enum UsersActionTypes {
    LIST_USERS = '[Users] List of users',
    LIST_USERS_SUCCESS = '[Users] List of users success',
    ADD_USER = '[Users] Add new user',
    UPDATE_USER = '[Users] Update user',
    DELETE_USER = '[Users] Delete user',
};

export class ListUsers implements Action {
    readonly type = UsersActionTypes.LIST_USERS;
    constructor(public payload: userModel) { }
}

export class ListUsersSuccess implements Action {
    readonly type = UsersActionTypes.LIST_USERS_SUCCESS;
    constructor(public payload: userModel[]) { }
}

export class AddUser implements Action {
    readonly type = UsersActionTypes.ADD_USER;
    constructor(public payload: userModel) { }
}

export class UpdateUser implements Action {
    readonly type = UsersActionTypes.UPDATE_USER;
    constructor(public payload: userModel) { }
}

export class DeleteUser implements Action {
    readonly type = UsersActionTypes.DELETE_USER;
    constructor(public payload: userModel) { }
}

export type UsersActions
                        = ListUsers
                        | ListUsersSuccess 
                        | AddUser
                        | UpdateUser
                        | DeleteUser;
