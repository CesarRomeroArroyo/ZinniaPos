import { IMetricCardInputs } from "src/app/core/interfaces/metric-card.interfaces";
import { IToastOptions } from "src/app/core/interfaces/toast.interface";

export const quickAccessEditConfig = {
    title: "Modulos",
    description: "Agrega o elimina modulos adicionales a los establecidos por defecto para tu negocio."
}

export const quickAccessAddMessages: Record<string, IToastOptions> = {
    "success": { message: 'Modulo agregado correctamente.', color: 'success'},
    "error": { message: 'No se logro agregar el modulo.', color: 'danger'},
};

export const quickAccessDeletionMessage: Record<string, IToastOptions> = {
    "success": { message: 'Modulo removido correctamente.', color: 'success'},
    "error": { message: 'No se logro revover el modulo.', color: 'danger'},
};

export const quickAccessEditingActions: Record<string, Record<string, IToastOptions>> = {
    "save": quickAccessAddMessages,
    "delete": quickAccessDeletionMessage,
}

export const metricCardConfig: IMetricCardInputs = {
    title: 'Ventas',
    valueMetric: '',
    deltaMetric: '',
    graphicPoints: '',
}
