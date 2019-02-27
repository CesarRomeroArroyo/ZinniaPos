import { ThirdModel } from './thirdsModel';
export class ReservationsModel {
    id: string;
    cliente: ThirdModel;
    fecha: Date;
    notas: string;
}