import { ISelectOption } from "../select-options-modal.interface";

export interface IAppointmentType {
    id?: string | number;
    name: string;
    userId: string | null;
    description: string;
}