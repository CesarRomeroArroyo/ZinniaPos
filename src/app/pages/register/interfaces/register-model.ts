// TODO: Añade los campos necesarios para el registro de un usuario y una empresa.

export interface BusinessRegisterInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
    ruc: string;
    type: string;
}

export interface UserRegisterInfo {
    name: string;
    email: string;
    password: string;
}