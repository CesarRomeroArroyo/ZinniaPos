export interface IDiscount {
    id?: string;
    type: DiscountType;
    value: number;
    reason: string;
}

export type DiscountType = "amount" | "percentage";