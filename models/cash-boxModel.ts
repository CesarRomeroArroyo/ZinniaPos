import { SellersModel } from './sellersModel';
export class CashboxMovesModel {
    id: string;
    numero: number;
    vendedor: SellersModel;
    tipo: string;
    fecha: Date;
    valor: number;
    detalle: string;
    idunico: string;    
    m_10: number;
    m_20: number;
    m_50: number;
    m_100: number;
    m_200: number;
    m_500: number;
    m_1000: number;
    b_1000: number;
    b_2000: number;
    b_5000: number;
    b_10000: number;
    b_20000: number;
    b_50000: number;
    estado: boolean;
}