import { delay, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ITax, ITaxPayload } from '../../interfaces/bussiness/tax.interface';

@Injectable({ providedIn: 'root' })
export class TaxService {

  // Mock temporal
  private taxesMock: ITax[]  = [
    { id: '1', name: 'IVA 19%', percentage: 19, type: 'added' },
  ];

  constructor(private _httpClient: HttpClient) {}

  /** Obtener impuestos del usuario */
  public getAllTaxes(userId: string): Observable<ITax[]> {
    // return this._httpClient.get<ITax[]>(`${environment.API}/taxes/${userId}`);
    return of(this.taxesMock).pipe(delay(800));
  }

  /** Guardar/crear impuesto */
  public saveTax(newTax: ITaxPayload): Observable<boolean> {
    // return this._httpClient.post(`${environment.API}/taxes`, newTax).pipe(map(() => true));
    return of(true).pipe(delay(800));
  }
}
