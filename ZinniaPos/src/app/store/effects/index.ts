import {UsersEffects} from './users.effects';
import { ProfilesEffects } from './profiles.effects';

export const effectArray: any[] = [
    UsersEffects,
    ProfilesEffects
]; 

export * from './users.effects';
export * from './profiles.effects';