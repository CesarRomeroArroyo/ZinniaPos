import { delay, lastValueFrom, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  IAppointment,
  IAppointmentPayload,
} from "../../interfaces/bussiness/appointment.interface";
import {
  OrderStatusValue,
  OriginOfOrder,
} from "../../consts/enums/business/order.enum";
import { AppointmentStatusValue } from "../../consts/enums/business/appointment.enum";
import { OriginRequest } from "../../consts/enums/request.enum";

@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  private appointmentMock: IAppointment[] = [
    {
      id: "B04",
      customer: {
        id: "1",
        fullname: "Adalberto Fabra Rodriguez",
        email: "adalberto.fabra@cecar.edu.co",
        mobile: "3116791102",
        address: "Calle 12 #7-235",
      },
      appointmentType: {
        id: 1,
        userId: null,
        name: "Consulta General",
        description: "Consulta basica de 20min max.",
      },
      status: AppointmentStatusValue.CONFIRMED,
      createAt: "2025-08-07T23:13:36.000000Z",
      appointmentDate: "2025-10-07T23:13:36.000000Z",
      origin: OriginRequest.WHATSAPP,
    },
    {
      id: "B04",
      customer: {
        id: "1",
        fullname: "Adalberto Fabra Rodriguez",
        email: "adalberto.fabra@cecar.edu.co",
        mobile: "3116791102",
        address: "Calle 12 #7-235",
      },
      appointmentType: {
        id: 1,
        userId: null,
        name: "Consulta General",
        description: "Consulta basica de 20min max.",
      },
      status: AppointmentStatusValue.CONFIRMED,
      createAt: "2025-08-07T23:13:36.000000Z",
      appointmentDate: "2025-10-07T23:13:36.000000Z",
      origin: OriginRequest.APPLICATION,
    },
  ];

  constructor(private _httpClient: HttpClient) {}

  public getAllAppointment(userId: string): Observable<IAppointment[]> {
    /*
        return await lastValueFrom(
            this._httpClient.get<any>(`${environment.API}/getByIdUnico/firmas/${userId}`
        ));
        */
    return of(this.appointmentMock).pipe(delay(3000));
  }

  public saveAppointment(newOrder: IAppointmentPayload): Observable<boolean> {
    /*
        return await lastValueFrom(
            this._httpClient.post<any>(`${environment.API}/save/firmas/`, payload
        ));
        */
    return of(true).pipe(delay(3000));
  }
}
