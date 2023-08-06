import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProxyService {
  constructor(
    private http: HttpClient
  ) {}

  public async getMethod(url: string){
    return await this.http.get(environment.api_url+url).toPromise();
  }
  
  public async postMethod(url: string, body: any){
    return await this.http.post(environment.api_url+url, body).toPromise();
  }

  public async putMethod(url: string, body: any){
    return await this.http.put(environment.api_url+url, body).toPromise();
  }

  public async deleteMethod(url: string, id: any){
    return await this.http.delete(environment.api_url+url+'/'+id).toPromise();
  }

  public async getParams(group: string){
    return await this.http.get(environment.api_url+'getParamsByGroup/'+group).toPromise();
  }
}
