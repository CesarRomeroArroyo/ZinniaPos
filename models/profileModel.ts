import { PermissionsModel } from './permissionsModel';
export class ProfileModel {
    id: string;
    nombre: string;
    permisos: PermissionsModel[];
    estado: boolean;
}