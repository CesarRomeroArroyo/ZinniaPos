import { Iheader } from "src/app/core/interfaces/header.interface";
import { ISelectModalConfig, ISelectOption } from "src/app/core/interfaces/select-options-modal.interface";

export const typesOfConsultation: ISelectOption[] = [
    {
        id: 1,
        label: 'Consulta General',
        value: 'Consulta General'
    },
    {
        id: 2,
        label: 'Consulta Especializada',
        value: 'Consulta Especializada'
    }
];

export const dayServiceOptions: ISelectOption[] = [
    {
        id: 1,
        label: 'Seleccionar días del mes',
        value: 'Seleccionar días del mes'
    },
    {
        id: 2,
        label: 'Seleccionar días de la semana',
        value: 'Seleccionar dias del mes'
    }
];

export const settingHeader: Iheader = {
    title: 'Horarios de atención',
    interface: 'modal'
}

export const consultationTypeConfig: ISelectModalConfig = {
    headerTitle: 'Tipo de consulta',
    optionsList: typesOfConsultation,
    actionButton: true
}

export const serviceDaysConfig: ISelectModalConfig = {
    headerTitle: 'Aplicar a',
    optionsList: dayServiceOptions,
    actionButton: false
}