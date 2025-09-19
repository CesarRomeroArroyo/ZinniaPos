import { ISelectModalConfig, ISelectOption } from "src/app/core/interfaces/select-options-modal.interface";
import { UpsertAppointmentTypeComponent } from "./components/upsert-appointment-type/upsert-appointment-type.component";
import { IAppointmentType } from "src/app/core/interfaces/bussiness/appointments-type.interface";

export enum ValueAppointmentType {
    GENERAL = 1,
    SPECIALIZED = 2,
}

export const consultationTypeConfig: ISelectModalConfig = {
    headerTitle: 'Tipo de consulta',
    optionsList: [],
    actionButton: true,
    componentToOpen: UpsertAppointmentTypeComponent
}

export function mapObjectToSelectOptions(appointmentTypes: IAppointmentType[]): ISelectOption[] {
    return appointmentTypes.map((appointment) => ({
      title: appointment.name,
      subtitle: appointment.description,
      value: appointment.id,
    }));
}