export interface BillInvoicePaymentForm {
    id: number;
    invoice: string;
    payment: number;
    payment_form: string;
    payment_term: string;
    installments: number;
    payment_date: Date;
    state: number;
  }
  