import * as fromProfilesActions from '../actions/profiles.action';
import { ProfileModel } from 'src/app/models/profileModel';


export interface profileState {
    profiles: ProfileModel[];
}

const initialState: profileState = {
    profiles: undefined
};

export function ProfilesReducer(state = initialState, action: fromProfilesActions.ProfilesActions ): profileState {
    switch (action.type) {
        case fromProfilesActions.ProfileActionTypes.ADD_PROFILE:
            return {
                ...state,
                profiles: [action.payload]
            }

        case fromProfilesActions.ProfileActionTypes.LIST_PROFILES:
            return {
                ...state
            }
        
        case fromProfilesActions.ProfileActionTypes.LIST_PROFILES_SUCCESS: 
            return {
                ...state,
                profiles: action.payload
            }    

        default: {
            return {
                ...state
            }
        }
    }
}