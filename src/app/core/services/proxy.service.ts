import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProxyService {
  constructor(
    private http: HttpClient
  ) {}

  // GET method
  public async getMethod(url: string): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.get(environment.api_url + url));
      return response || []; // Asegura que siempre se devuelve un valor, incluso si es undefined
    } catch (error) {
      console.error('Error in GET method:', error);
      return [];
    }
  }

  // POST method
  public async postMethod(url: string, body: any): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.post(environment.api_url + url, body));
      return response;
    } catch (error) {
      console.error('Error in POST method:', error);
      return null;
    }
  }

  // PUT method
  public async putMethod(url: string, body: any): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.put(environment.api_url + url, body));
      return response;
    } catch (error) {
      console.error('Error in PUT method:', error);
      return null;
    }
  }

  // DELETE method
  public async deleteMethod(url: string, id: any): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.delete(`${environment.api_url}${url}/${id}`));
      return response;
    } catch (error) {
      console.error('Error in DELETE method:', error);
      return null;
    }
  }

  // GET with parameters
  public async getParams(group: string): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.get(`${environment.api_url}getParamsByGroup/${group}`));
      return response || [];
    } catch (error) {
      console.error('Error in GET Params method:', error);
      return [];
    }
  }
}
