import { Iheader } from "src/app/core/interfaces/header.interface";
import { IToastOptions } from "src/app/core/interfaces/toast.interface";

export const settingHeader: Iheader = {
    title: 'Pedidos',
    interface: 'modal'
}

export const waitingMessageOrderLoading = "Cargando ordenes...";


export const ordersGetMessages: Record<string, IToastOptions> = {
    "success": { message: 'Ordenes obtenidas correctamente.', color: 'success'},
    "error": { message: 'No se lograron obtener las ordenes.', color: 'danger'}
}