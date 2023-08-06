export interface ShoppingBill {
    id: number;
    uniqueid: string;
    supplier: string;
    bill_number: string;
    expedition_date: Date;
    due_date: Date;
    installments: number;
    tax: number;
    retefue: number;
    total_taxed: number;
    total_exempt: number;
    total_excluded: number;
    base: number;
    total: number;
    state: number;
  }
  