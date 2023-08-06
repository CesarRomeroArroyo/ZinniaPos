export interface BillInvoice {
    id: number;
    bill_resolution: string;
    bill_number: number;
    bill_date: Date;
    customer: string;
    vendor: string;
    total: number;
    location: string;
    uniqueid_closed: string;
    iva: number;
    retefuente: number;
    base: number;
    tips: number;
    table: string;
    discount: number;
    state: number; // 1-open-2-close-3-cancel
  }
  