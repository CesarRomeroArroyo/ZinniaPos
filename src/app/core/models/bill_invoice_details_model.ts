export interface BillInvoiceDetails {
    id: number;
    invoice: string;
    item: string;
    quantity: number;
    base: number;
    discount: string;
    discount_value: number;
    tax: string;
    tax_value: number;
    total: number;
    table: string;
  }
  