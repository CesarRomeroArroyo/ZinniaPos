export type TaxType = 'included' | 'added';

export interface ITax {
    id?: string;
    name: string;
    percentage: number;
    type: TaxType;
}

export interface ITaxPayload extends ITax {
    userId: string;
}