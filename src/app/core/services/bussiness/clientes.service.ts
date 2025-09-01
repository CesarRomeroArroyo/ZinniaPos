// src/app/core/services/bussiness/clientes.service.ts
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../data/api.service';

export interface ClienteApi {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  fecha_registro: string;
}
export interface CreateClienteDto {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  fecha_registro?: string;
}
export interface CreateClienteResult { ok: boolean; id?: string; raw?: any; }

// Helpers de tipos
type BackendErrors = Record<string, string | string[]>;
function hasDataArray(x: unknown): x is { data: unknown[] } {
  return !!x && typeof x === 'object' && 'data' in (x as any);
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  // Cambia a '/clientes/' si tu backend lo publica con slash final
  private static readonly PATH = '/clientes';

  constructor(private api: ApiService) {}

  /** Normaliza posibles variantes del backend a nuestra interfaz */
  private normalize = (raw: any): ClienteApi => ({
    id: String(raw?.id ?? ''),
    nombre: raw?.nombre ?? '',
    correo: raw?.correo ?? raw?.email ?? '', // email→correo
    telefono: String(raw?.telefono ?? ''),
    direccion: raw?.direccion ?? '',
    fecha_registro: String(raw?.fecha_registro ?? raw?.fechaRegistro ?? raw?.fecha ?? ''),
  });

  // ---------- GET /clientes ----------
  async getClientes(): Promise<ClienteApi[]> {
    const data = await firstValueFrom(this.api.get<ClienteApi>(ClientesService.PATH));
    const arr: ClienteApi[] =
      Array.isArray(data) ? data :
      (hasDataArray(data) && Array.isArray((data as any).data)) ? (data as any).data :
      [];
    return (arr as any[]).map(this.normalize);
  }

  // ---------- POST /clientes (x-www-form-urlencoded) ----------
  async createCliente(input: CreateClienteDto): Promise<CreateClienteResult> {
    // Mapea 'correo' → 'email' como espera la API
    const payload: Record<string, any> = {
      nombre: input.nombre,
      email:  input.correo,
      telefono: input.telefono,
      direccion: input.direccion,
      ...(input.fecha_registro ? { fecha_registro: input.fecha_registro } : {}),
    };

    try {
      // Envía como application/x-www-form-urlencoded
      const resp: any = await firstValueFrom(
        this.api.postUrlEncoded<any>(ClientesService.PATH, payload)
      );
      const ok = resp?.success === true || resp?.ok === true || true;
      const rawId = resp?.id;
      const id = rawId !== true && rawId != null ? String(rawId) : undefined;
      return { ok, id, raw: resp };
    } catch (e: unknown) {
      const msg = this.extractFirstErrorMessage(e) ?? 'No se pudo crear el cliente';
      throw new Error(String(msg));
    }
  }

  /** Extrae el primer mensaje legible de validaciones/errores del backend */
  private extractFirstErrorMessage(err: any): string | undefined {
    if (typeof err?.error?.message === 'string' && err.error.message.trim()) {
      return err.error.message.trim();
    }
    const errors = (err?.error?.errors ?? err?.errors) as BackendErrors | undefined;
    if (errors && typeof errors === 'object') {
      const v = Object.values(errors)[0];
      if (Array.isArray(v)) return String(v[0] ?? '').trim() || undefined;
      if (typeof v === 'string') return v.trim() || undefined;
    }
    if (typeof err?.message === 'string' && err.message.trim()) {
      return err.message.trim();
    }
    return undefined;
  }
}
