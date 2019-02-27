import { ClientModel } from './clientModel';
export class ReservationsModel {
    id: string;
    cliente: ClientModel;
    fecha: Date;
    notas: string;
}