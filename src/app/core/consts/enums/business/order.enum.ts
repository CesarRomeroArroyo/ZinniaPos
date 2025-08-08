export enum OriginOfOrder {
    APPLICATION = "origin:appZinnia&type:internalOrigin",
    WHATSAPP = "origin:whatsappInc&type:externalOrigin"
}   

export enum OrderStatusValue {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    DELIVERED = 'delivered',
    CANCELED = 'canceled'
}
