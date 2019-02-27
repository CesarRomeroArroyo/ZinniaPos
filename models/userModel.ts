import { ProfileModel } from './profileModel';
export class userModel {
    id: string;
    nombre: string;
    usuario: string;
    password: string;
    perfil: ProfileModel;
    estado: boolean;
}