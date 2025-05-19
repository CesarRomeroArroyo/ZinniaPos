import { Iheader } from "src/app/core/interfaces/header.interface";
import { ISelectModalConfig, ISelectOption } from "src/app/core/interfaces/select-options-modal.interface";

export enum ValueServiceDaysOptions {
    DAYS_OF_MONTH = 1,
    WEEK_DAYS = 2,
}

export const dayServiceOptions: ISelectOption[] = [
    {
        title: 'Seleccionar días del mes',
        value: ValueServiceDaysOptions.DAYS_OF_MONTH
    },
    {
        title: 'Seleccionar días de la semana',
        value: ValueServiceDaysOptions.WEEK_DAYS
    }
];

export const settingHeader: Iheader = {
    title: 'Horarios de atención',
    interface: 'modal'
}

export const serviceDaysConfig: ISelectModalConfig = {
    headerTitle: 'Aplicar a',
    optionsList: dayServiceOptions,
    actionButton: false
}

export const WEEK_DAYS = [
    { label: 'Lunes', key: 'monday' },
    { label: 'Viernes', key: 'friday' },

    { label: 'Martes', key: 'tuesday' },
    { label: 'Sábado', key: 'saturday' },

    { label: 'Miércoles', key: 'wednesday' },
    { label: 'Domingo', key: 'sunday' },

    { label: 'Jueves', key: 'thursday' },
];