import { AppointmentStatusValue } from "../../consts/enums/business/appointment.enum";
import { OriginRequest } from "../../consts/enums/request.enum";
import { IAppointmentType } from "./appointments-type.interface";
import { ICustomer } from "./customers.interface";

export interface IAppointmentPayload {
  userId: string;
  customerId: string;
  discount?: number;
  estimatedTax?: number;
  subtotal: number;
  total: number;
  status: AppointmentStatusValue;
  origin: OriginRequest;
}

export interface IAppointment {
  customer: ICustomer;
  id: string;
  appointmentType: IAppointmentType;
  status: AppointmentStatus;
  createAt: string;
  appointmentDate: string;
  origin: OriginRequest;
}

export type AppointmentStatus =
  | AppointmentStatusValue.PENDING
  | AppointmentStatusValue.CONFIRMED
  | AppointmentStatusValue.SCHEDULED
  | AppointmentStatusValue.CANCELED;
