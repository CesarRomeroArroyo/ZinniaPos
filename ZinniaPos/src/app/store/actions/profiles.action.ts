import { Action } from '@ngrx/store';
import { ProfileModel } from 'src/app/models/profileModel';


export enum ProfileActionTypes {
    LIST_PROFILES = '[Profile] List of profile',
    LIST_PROFILES_SUCCESS = '[Profile] List of profile success',
    ADD_PROFILE = '[Profile] Add new profile',
    UPDATE_PROFILE = '[Profile] Update profile',
    DELETE_PROFILE = '[Profile] Delete profile',
};

export class ListProfiles implements Action {
    readonly type = ProfileActionTypes.LIST_PROFILES;
    constructor(public payload: ProfileModel) { }
}

export class ListProfilesSuccess implements Action {
    readonly type = ProfileActionTypes.LIST_PROFILES_SUCCESS;
    constructor(public payload: ProfileModel[]) { }
}

export class AddProfile implements Action {
    readonly type = ProfileActionTypes.ADD_PROFILE;
    constructor(public payload: ProfileModel) { }
}

export class UpdateProfile implements Action {
    readonly type = ProfileActionTypes.UPDATE_PROFILE;
    constructor(public payload: ProfileModel) { }
}

export class DeleteProfile implements Action {
    readonly type = ProfileActionTypes.DELETE_PROFILE;
    constructor(public payload: ProfileModel) { }
}

export type ProfilesActions
                        = ListProfiles
                        | ListProfilesSuccess 
                        | AddProfile
                        | UpdateProfile
                        | DeleteProfile;
