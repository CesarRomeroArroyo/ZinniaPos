// src/app/core/services/bussiness/appointments.service.ts
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/data/api.service';

export type CitaEstado = 'Agendada' | 'Completada' | 'Cancelada' | string;

export interface AppointmentApi {
  id: string;
  cliente_id: string;
  servicio_id: string;
  fecha: string;        // 'YYYY-MM-DD'
  hora_inicio: string;  // 'HH:mm:ss'
  hora_fin: string;     // 'HH:mm:ss'
  estado: CitaEstado;
  origen?: string;
  telefono?: string;
  updated_at?: string;
  cliente_nombre?: string;
  servicio_nombre?: string;
}

export interface CreateAppointmentDto {
  clienteId: string;
  servicio_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado?: CitaEstado;
}
export type UpdateAppointmentDto = Partial<
  Pick<CreateAppointmentDto, 'servicio_id' | 'fecha' | 'hora_inicio' | 'hora_fin' | 'estado'>
>;
export interface CreateAppointmentResult { ok: boolean; id?: string; raw?: any; }

type BackendErrors = Record<string, string | string[]>;
function unwrapArray(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object' && Array.isArray(raw.data)) return raw.data;
  return [];
}

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  // probamos varios prefijos por si el backend varía
  private static readonly BASES = ['/citas', '/citas/', '/appointments', '/appointments/'];
  private static readonly BY_CLIENTE_PATHS = ['cliente', 'by-cliente', 'client'];

  constructor(private api: ApiService) {}

  // ----- Normalización -----
  private normalize = (raw: any): AppointmentApi => ({
    id: String(raw?.id ?? ''),
    cliente_id: String(raw?.cliente_id ?? raw?.ClienteId ?? raw?.clienteId ?? ''),
    servicio_id: String(raw?.servicio_id ?? raw?.servicioId ?? ''),
    fecha: String(raw?.fecha ?? ''),
    hora_inicio: String(raw?.hora_inicio ?? raw?.horaInicio ?? ''),
    hora_fin: String(raw?.hora_fin ?? raw?.horaFin ?? ''),
    estado: String(raw?.estado ?? 'Agendada'),
    origen: raw?.origen ?? raw?.source ?? undefined,
    telefono: raw?.telefono ?? raw?.numero_celular ?? undefined,
    updated_at: raw?.updated_at ?? raw?.updatedAt ?? undefined,
    cliente_nombre: raw?.cliente_nombre ?? raw?.clienteNombre ?? undefined,
    servicio_nombre: raw?.servicio_nombre ?? raw?.servicioNombre ?? undefined,
  });

  private errMsg(err: any): string | undefined {
    if (typeof err?.error?.message === 'string' && err.error.message.trim()) return err.error.message.trim();
    const errors = (err?.error?.errors ?? err?.errors) as BackendErrors | undefined;
    if (errors && typeof errors === 'object') {
      const v = Object.values(errors)[0];
      if (Array.isArray(v)) return String(v[0] ?? '').trim() || undefined;
      if (typeof v === 'string') return v.trim() || undefined;
    }
    if (typeof err?.message === 'string' && err.message.trim()) return err.message.trim();
    return undefined;
  }

  // ----- Helpers -----
  private async tryGetMany(paths: string[]): Promise<any[]> {
    let lastErr: any;
    for (const p of paths) {
      try {
        const raw = await firstValueFrom(this.api.get<any>(p));
        return unwrapArray(raw);
      } catch (e) { lastErr = e; }
    }
    throw lastErr;
  }
  private async tryGetOne(paths: string[]): Promise<any> {
    let lastErr: any;
    for (const p of paths) {
      try {
        return await firstValueFrom(this.api.get<any>(p));
      } catch (e) { lastErr = e; }
    }
    throw lastErr;
  }

  // ----- Endpoints -----

  /** GET lista completa (preferir para armar resumen por cliente) */
  async getAll(): Promise<AppointmentApi[]> {
    const arr = await this.tryGetMany(AppointmentsService.BASES);
    return arr.map(this.normalize);
  }

  /** Igual que getAll pero si falla, devuelve [] sin lanzar error (evita popups globales) */
  async getAllSafe(): Promise<AppointmentApi[]> {
    try { return await this.getAll(); }
    catch { return []; }
  }

  /** GET /{base}/{id} */
  async getById(id: string): Promise<AppointmentApi> {
    const paths = AppointmentsService.BASES.map(b => `${b}${b.endsWith('/') ? '' : '/'}${encodeURIComponent(id)}`);
    try {
      const data = await this.tryGetOne(paths);
      return this.normalize(data?.data ?? data);
    } catch (e: any) {
      throw new Error(this.errMsg(e) ?? 'No se pudo obtener la cita');
    }
  }

  /** GET /{base}/(cliente|by-cliente|client)/:id */
  async getByCliente(clienteId: string): Promise<AppointmentApi[]> {
    const paths: string[] = [];
    for (const b of AppointmentsService.BASES) {
      const base = b.endsWith('/') ? b.slice(0, -1) : b;
      for (const seg of AppointmentsService.BY_CLIENTE_PATHS) {
        paths.push(`${base}/${seg}/${encodeURIComponent(clienteId)}`);
      }
    }
    const arr = await this.tryGetMany(paths);
    return arr.map(this.normalize);
  }

  /** POST create */
  async create(input: CreateAppointmentDto): Promise<CreateAppointmentResult> {
    const payload = {
      ClienteId: input.clienteId,
      servicio_id: input.servicio_id,
      fecha: input.fecha,
      hora_inicio: input.hora_inicio,
      hora_fin: input.hora_fin,
      ...(input.estado ? { estado: input.estado } : {}),
    };
    let lastErr: any;
    for (const b of AppointmentsService.BASES) {
      try {
        const resp = await firstValueFrom(this.api.post<any>(b, payload));
        const ok = resp?.success === true || resp?.ok === true || true;
        const rawId = resp?.id ?? resp?.data?.id;
        const id = rawId != null && rawId !== true ? String(rawId) : undefined;
        return { ok, id, raw: resp };
      } catch (e) { lastErr = e; }
    }
    throw new Error(this.errMsg(lastErr) ?? 'No se pudo crear la cita');
  }

  /** PUT update */
  async update(id: string, changes: UpdateAppointmentDto): Promise<boolean> {
    const payload: any = {
      ...(changes.servicio_id ? { servicio_id: changes.servicio_id } : {}),
      ...(changes.fecha ? { fecha: changes.fecha } : {}),
      ...(changes.hora_inicio ? { hora_inicio: changes.hora_inicio } : {}),
      ...(changes.hora_fin ? { hora_fin: changes.hora_fin } : {}),
      ...(changes.estado ? { estado: changes.estado } : {}),
    };
    let lastErr: any;
    for (const b of AppointmentsService.BASES) {
      const url = `${b}${b.endsWith('/') ? '' : '/'}${encodeURIComponent(id)}`;
      try { await firstValueFrom(this.api.put<any>(url, payload)); return true; }
      catch (e) { lastErr = e; }
    }
    throw new Error(this.errMsg(lastErr) ?? 'No se pudo actualizar la cita');
  }

  /** PUT cancelar */
  async cancel(id: string): Promise<boolean> {
    let lastErr: any;
    for (const b of AppointmentsService.BASES) {
      const base = b.endsWith('/') ? b.slice(0, -1) : b;
      const url = `${base}/${encodeURIComponent(id)}/cancelar`;
      try { await firstValueFrom(this.api.put<any>(url, {})); return true; }
      catch (e) { lastErr = e; }
    }
    throw new Error(this.errMsg(lastErr) ?? 'No se pudo cancelar la cita');
  }
}
