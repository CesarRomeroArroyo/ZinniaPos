// src/app/data/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = (environment as any).apiBase ?? (environment as any).API;
  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, any>) {
    let hp = new HttpParams();
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v == null) continue;
        if (Array.isArray(v)) v.forEach(val => hp = hp.append(k, String(val)));
        else hp = hp.set(k, String(v));
      }
    }
    return this.http.get<T>(`${this.base}${path}`, { params: hp });
  }

  post<T>(path: string, body: any)  { return this.http.post<T>(`${this.base}${path}`, body); }
  put<T>(path: string, body: any)   { return this.http.put<T>(`${this.base}${path}`, body); }
  delete<T>(path: string)           { return this.http.delete<T>(`${this.base}${path}`); }
  upload<T>(path: string, fd: FormData) { return this.http.post<T>(`${this.base}${path}`, fd); }

  /** 👇 Nuevo: POST x-www-form-urlencoded (evita preflight si no agregas headers raros) */
  postUrlEncoded<T>(path: string, payload: Record<string, any>) {
    const fromObject: Record<string, string> = {};
    for (const [k, v] of Object.entries(payload)) fromObject[k] = v == null ? '' : String(v);
    const body = new HttpParams({ fromObject }).toString();
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    });
    return this.http.post<T>(`${this.base}${path}`, body, { headers });
  }
}
