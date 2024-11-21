import { ISelectOption } from "src/app/core/consts/types/select-options.type";
import { Iheader } from "src/app/core/interfaces/header.interface";

export const settingHeader: Iheader = {
    title: 'Horarios de atención',
    interface: 'modal'
}

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

export const options: ISelectOption[] = [
    {
        id: 1,
        label: 'Solo este día',
        value: 'Solo este día'
    },
    {
        id: 2,
        label: 'Todos los días',
        value: 'Todos los días'
    },
    {
        id: 3,
        label: 'Seleccionar días de la semana',
        value: 'Seleccionar dias del mes'
    }
];