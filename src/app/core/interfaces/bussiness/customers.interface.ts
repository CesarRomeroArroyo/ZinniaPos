export interface ICustomer {
    id: string;
    fullname: string;
    email: string;
    mobile: string;
    address: string;
}

export interface ICustomerPayload extends ICustomer {
    userId: string;
}