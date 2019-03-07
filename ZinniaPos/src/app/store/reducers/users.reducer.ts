import * as fromUserActions from '../actions/users.action';
import { userModel } from 'src/app/models/userModel';
import { ProfileModel } from 'src/app/models/profileModel';

export interface userState {
    users: userModel[];
}

const initialState: userState = {
    users: undefined
};

export function UserReducer(state = initialState, action: fromUserActions.UsersActions ): userState {
    switch (action.type) {
        case fromUserActions.UsersActionTypes.ADD_USER:
            return {
                ...state,
                users: [action.payload]
            }

        case fromUserActions.UsersActionTypes.LIST_USERS:
            return {
                ...state
            }
        
        case fromUserActions.UsersActionTypes.LIST_USERS_SUCCESS: 
            return {
                ...state,
                users: action.payload
            }    

        default: {
            return {
                ...state
            }
        }
    }
}