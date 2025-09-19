import { delay, lastValueFrom, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IAppointmentType } from '../../interfaces/bussiness/appointments-type.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentTypeService {

    private appointmentTypesMock: IAppointmentType[]  = [
        {
            id: 1,
            userId: null,
            name: 'Consulta General',
            description: 'Consulta basica de 20min max.',
        },
        {
            id: 2,
            userId: null,
            name: 'Consulta Especializada',
            description: 'Consulta especializada de 1h max.',
        },
        {
            id: 3,
            userId: "2808",
            name: 'Consulta a Domicilio',
            description: 'Consulta personalizada a domicilio.',
        },
    ];

    constructor(
        private _httpClient: HttpClient,
    ) { }

    public getAppointmentTypes(userId: string): Observable<IAppointmentType[]> {
        /*
        return await lastValueFrom(
            this._httpClient.get<any>(`${environment.API}/getByIdUnico/firmas/${userId}`
        ));
        */
        return of(this.appointmentTypesMock).pipe(delay(3000));
    }

    public async saveAppointmentType(newAppointmentType: IAppointmentType): Promise<any> {
        /*
        return await lastValueFrom(
            this._httpClient.post<any>(`${environment.API}/save/firmas/`, payload
        ));
        */
        this.appointmentTypesMock.push(newAppointmentType);
        return of(this.appointmentTypesMock).pipe(delay(5000));
    }

}