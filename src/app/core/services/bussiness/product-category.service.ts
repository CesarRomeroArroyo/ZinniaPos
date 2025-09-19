import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../data/api.service';

export interface CategoriaApi {
  id: string;
  nombre: string;
  descripcion: string;
  impuesto: number;
  fecha_registro: string;
}

export interface CreateCategoriaDto {
  nombre: string;
  impuesto: number;
  fecha_registro?: string;
}

export interface CreateCategoriaResult { ok: boolean; id?: string; raw?: any; }

// Helpers de tipos (igual que en clientes.service)
type BackendErrors = Record<string, string | string[]>;
function hasDataArray(x: unknown): x is { data: unknown[] } {
  return !!x && typeof x === 'object' && 'data' in (x as any);
}

@Injectable({ providedIn: 'root' })
export class ProductCategoryService {
  // Ajusta a '/categorias/' si tu backend usa slash final
  private static readonly PATH = '/categorias';

  constructor(private api: ApiService) {}

  /** Normaliza posibles variantes del backend a nuestra interfaz */
  private normalize = (raw: any): CategoriaApi => ({
    id: String(raw?.id ?? ''),
    nombre: raw?.nombre ?? raw?.name ?? '',
    descripcion: raw?.descripcion ?? raw?.description ?? '',
    impuesto: Number(raw?.impuesto ?? raw?.tax ?? 0),
    fecha_registro: String(raw?.fecha_registro ?? raw?.fechaRegistro ?? raw?.fecha ?? ''),
  });

  // ---------- GET /categorias ----------
  async getCategorias(): Promise<CategoriaApi[]> {
    const data = await firstValueFrom(this.api.get<unknown>(ProductCategoryService.PATH));
    const arr: unknown[] =
      Array.isArray(data) ? data :
      (hasDataArray(data) && Array.isArray((data as any).data)) ? (data as any).data :
      [];
    return (arr as any[]).map(this.normalize);
  }

  // ---------- POST /categorias (x-www-form-urlencoded) ----------
  async createCategoria(input: CreateCategoriaDto): Promise<CreateCategoriaResult> {
    // El backend pide { nombre, impuesto }
    const payload: Record<string, any> = {
      nombre: input.nombre,
      impuesto: Number(input.impuesto), // asegura número
      ...(input.fecha_registro ? { fecha_registro: input.fecha_registro } : {}),
    };

    try {
      // Envía como application/x-www-form-urlencoded (igual que clientes)
      const resp: any = await firstValueFrom(
        this.api.postUrlEncoded<any>(ProductCategoryService.PATH, payload)
      );
      const ok = resp?.success === true || resp?.ok === true || true;
      const rawId = resp?.id;
      const id = rawId !== true && rawId != null ? String(rawId) : undefined;
      return { ok, id, raw: resp };
    } catch (e: unknown) {
      const msg = this.extractFirstErrorMessage(e) ?? 'No se pudo crear la categoría';
      throw new Error(String(msg));
    }
  }

  /**
   * (Opcional) Compatibilidad si tu componente usa .subscribe():
   * mapea { name, tax } -> { nombre, impuesto } y devuelve Observable<boolean>
   */
  saveCategory(form: { name: string; tax: number | string; fecha_registro?: string }): Observable<boolean> {
    const nombre = String(form?.name ?? '').trim();
    const impuesto = Number(String(form?.tax ?? 0).replace(',', '.'));

    const payload: Record<string, any> = {
      nombre,
      impuesto: isNaN(impuesto) ? 0 : impuesto,
      ...(form?.fecha_registro ? { fecha_registro: form.fecha_registro } : {}),
    };

    return this.api
      .postUrlEncoded<any>(ProductCategoryService.PATH, payload)
      .pipe(map((resp: any) => resp?.success === true || resp?.ok === true || true));
  }

  /** Igual que en clientes.service: primer mensaje legible del backend */
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
