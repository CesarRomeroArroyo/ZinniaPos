export interface User {
    id: number;
    user: string | null;
    pass: string | null;
    name: string | null;
    email: string;
    phone: string;
    location: string;
    token: string;
    uniqueid: string;
    onesignal: string;
    image: string;
    creation_date: Date;
    type: number; // 1-admin, 2-waiter, 3-chef, 4-customer, 5-supplier
    state: number;
  }
  