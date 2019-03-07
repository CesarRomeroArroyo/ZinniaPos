import * as reducers from './reducers';
import { ActionReducerMap } from '@ngrx/store';
import { userState } from './reducers/users.reducer';

export interface AppStore {
    users: reducers.userState
}


export const appReducers: ActionReducerMap<AppStore> = {
    users: reducers.UserReducer
}  