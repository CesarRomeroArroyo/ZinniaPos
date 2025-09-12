// src/app/data/api.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

type Opts = { skipAuth?: boolean };

@Injectable({ providedIn: "root" })
export class ApiService {
  private readonly base =
    (environment as any).apiBase ?? (environment as any).API;
  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, any>, opts?: Opts) {
    let hp = new HttpParams();
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v == null) continue;
        if (Array.isArray(v))
          v.forEach((val) => (hp = hp.append(k, String(val))));
        else hp = hp.set(k, String(v));
      }
    }
    let headers = new HttpHeaders();
    if (opts?.skipAuth) headers = headers.set("X-Skip-Auth", "1");
    return this.http.get<T>(`${this.base}${path}`, { params: hp, headers });
  }

  post<T>(path: string, body: any, opts?: Opts) {
    let headers = new HttpHeaders();
    if (opts?.skipAuth) headers = headers.set("X-Skip-Auth", "1");
    return this.http.post<T>(`${this.base}${path}`, body, { headers });
  }

  put<T>(path: string, body: any, opts?: Opts) {
    let headers = new HttpHeaders();
    if (opts?.skipAuth) headers = headers.set("X-Skip-Auth", "1");
    console.log("[ApiService.put] =>", `${this.base}${path}`, body);
    return this.http.put<T>(`${this.base}${path}`, body, { headers });
  }

  delete<T>(path: string, opts?: Opts) {
    let headers = new HttpHeaders();
    if (opts?.skipAuth) headers = headers.set("X-Skip-Auth", "1");
    return this.http.delete<T>(`${this.base}${path}`, { headers });
  }

  upload<T>(path: string, fd: FormData, opts?: Opts) {
    let headers = new HttpHeaders();
    if (opts?.skipAuth) headers = headers.set("X-Skip-Auth", "1");
    return this.http.post<T>(`${this.base}${path}`, fd, { headers });
  }

  /** POST x-www-form-urlencoded (simple request ⇒ sin preflight si no hay headers custom) */
  postUrlEncoded<T>(path: string, payload: Record<string, any>, opts?: Opts) {
    const fromObject: Record<string, string> = {};
    for (const [k, v] of Object.entries(payload))
      fromObject[k] = v == null ? "" : String(v);
    const body = new HttpParams({ fromObject }).toString();
    let headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Accept: "application/json",
    });
    if (opts?.skipAuth) headers = headers.set("X-Skip-Auth", "1");
    return this.http.post<T>(`${this.base}${path}`, body, { headers });
  }
}
