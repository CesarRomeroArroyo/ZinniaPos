import { OrderStatusValue } from "src/app/core/consts/enums/business/order.enum";

export const OrderStatusLabel: Record<OrderStatusValue, string> = {
    [OrderStatusValue.PENDING]: 'Pendiente',
    [OrderStatusValue.CONFIRMED]: 'Confirmado',
    [OrderStatusValue.CANCELED]: 'Cancelado',
    [OrderStatusValue.DELIVERED]: 'Entregado',
}