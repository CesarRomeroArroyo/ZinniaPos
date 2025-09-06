// src/app/core/services/bussiness/product.service.ts
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';
import { ApiService } from 'src/app/data/api.service';
import { IProduct } from 'src/app/core/interfaces/bussiness/product.interface';
import { ITax } from 'src/app/core/interfaces/bussiness/tax.interface';

/** Modelo normalizado desde el backend */
export interface ProductApi {
  id: string;
  nombre: string;
  categoria_id: string;

  /** campos opcionales */
  descripcion?: string;
  estado?: string;          // 'Activo' | 'Inactivo'
  proveedor_id?: string;
  impuesto?: number;        // p. ej. 18 -> 18%

  /** precios y stock */
  stock_actual?: number;
  precio?: number;          // si el backend envía un único campo
  precio_venta?: number;    // ← mapeado desde precio_venta | sale_price | pvp
  precio_costo?: number;    // ← mapeado desde precio_costo | cost_price | costo
}

/** Crear / Actualizar */
export interface CreateProductDto {
  nombre: string;
  precio: number; // si tu API usa precio_venta/costo en create, ajusta aquí
  categoria_id: string;
  descripcion?: string;
  stock_actual?: number;
  proveedor_id?: string;
  impuesto?: number;
}
export type UpdateProductDto = Partial<CreateProductDto>;

export interface CreateProductResult {
  ok: boolean;
  id?: string;
  raw?: any;
}

type BackendErrors = Record<string, string | string[]>;

@Injectable({ providedIn: 'root' })
export class ProductService {
  private static readonly BASE   = '/productos';
  private static readonly BY_ID  = (id: string) => `/productos/${id}`;
  private static readonly SEARCH = (q: string) => `/productosBuscar/${encodeURIComponent(q)}/`; // con "/" final
  private static readonly STOCK  = (productoId: string) => `/inventario/stock/${encodeURIComponent(productoId)}`;

  constructor(private api: ApiService) {}

  // ============ Helpers ============
  /** Convierte strings con coma/punto a number seguro */
  private toNumber(v: any): number {
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number') return isFinite(v) ? v : 0;
    const s = String(v).trim();
    if (!s) return 0;
    // normaliza "1.234,56" o "1,234.56"
    let nStr = s;
    const hasComma = s.includes(',');
    const hasDot = s.includes('.');
    if (hasComma && hasDot) {
      nStr = s.replace(/\./g, '').replace(',', '.');
    } else if (hasComma) {
      nStr = s.replace(',', '.');
    }
    const n = parseFloat(nStr);
    return isFinite(n) ? n : 0;
  }

  private normalize = (raw: any): ProductApi => ({
    id: String(raw?.id ?? ''),
    nombre: String(raw?.nombre ?? raw?.name ?? ''),
    categoria_id: String(raw?.categoria_id ?? raw?.category_id ?? raw?.categoriaId ?? ''),

    descripcion: raw?.descripcion ?? raw?.description ?? undefined,
    estado: raw?.estado ?? raw?.status ?? undefined,
    proveedor_id: raw?.proveedor_id ?? raw?.supplier_id ?? undefined,
    impuesto: raw?.impuesto != null ? this.toNumber(raw.impuesto) : undefined,

    // stock puede venir como stock_actual o stock
    stock_actual:
      raw?.stock_actual != null ? this.toNumber(raw.stock_actual)
      : raw?.stock != null ? this.toNumber(raw.stock)
      : undefined,

    // precios: acepta múltiples nombres de campo
    precio: raw?.precio != null ? this.toNumber(raw.precio) : (
      raw?.price != null ? this.toNumber(raw.price) : undefined
    ),
    precio_venta: (() => {
      if (raw?.precio_venta != null) return this.toNumber(raw.precio_venta);
      if (raw?.sale_price != null)   return this.toNumber(raw.sale_price);
      if (raw?.pvp != null)          return this.toNumber(raw.pvp);
      if (raw?.precio != null)       return this.toNumber(raw.precio); // fallback
      return undefined;
    })(),
    precio_costo: (() => {
      if (raw?.precio_costo != null) return this.toNumber(raw.precio_costo);
      if (raw?.cost_price != null)   return this.toNumber(raw.cost_price);
      if (raw?.costo != null)        return this.toNumber(raw.costo);
      return undefined;
    })(),
  });

  /** Convierte ProductApi → IProduct para las UIs que lo usan */
  public toIProduct = (p: ProductApi): IProduct => ({
    id: p.id as any,
    name: p.nombre,
    description: p.descripcion ?? '',
    // Usa precio_costo y precio_venta si existen; hace fallback a precio
    costPrice: this.toNumber(p.precio_costo ?? 0),
    salePrice: this.toNumber(p.precio_venta ?? p.precio ?? 0),
    stock: this.toNumber(p.stock_actual ?? 0),
    category: this.mapCategory(p.categoria_id),
    supplier: this.mapSupplier(p.proveedor_id),
    tax: this.mapTax(p.impuesto),
    images: [],
    status: (p.estado as any) ?? 'Activo',
  });

  /** number → ITax (ajusta al shape real de tu ITax si difiere) */
  private mapTax(raw?: number): ITax | undefined {
    if (raw == null) return undefined;
    const value = this.toNumber(raw);
    const taxObj = {
      id: 'default-tax',
      name: 'Impuesto',
      value,
      type: 'PERCENTAGE',
    } as any;
    return taxObj as ITax;
  }

  private mapCategory(id?: string) {
    if (!id) return undefined as any;
    return { id, name: '' } as any;
  }

  private mapSupplier(id?: string) {
    if (!id) return undefined as any;
    return { id, name: '' } as any;
  }

  private firstError(err: any): string | undefined {
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

  // ============ Endpoints ============

  /** GET /productos (por defecto where=1). Devuelve Observable<ProductApi[]> */
  getAll$(params?: { where?: string | number; categoria_id?: string; proveedor_id?: string }): Observable<ProductApi[]> {
    const query: Record<string, any> = { where: 1, ...(params ?? {}) };
    return this.api.get<any>(ProductService.BASE, query).pipe(
      map((data: any) => {
        const arr: unknown[] = Array.isArray(data) ? data : (data?.data ?? []);
        return (arr as any[]).map(this.normalize);
      })
    );
  }

  /** Promise wrapper si prefieres await */
  async getAll(params?: { where?: string | number; categoria_id?: string; proveedor_id?: string }): Promise<ProductApi[]> {
    return await firstValueFrom(this.getAll$(params));
  }

  /** GET /productos/{id} */
  async getById(id: string): Promise<ProductApi> {
    try {
      const data = await firstValueFrom(this.api.get<any>(ProductService.BY_ID(id)));
      return this.normalize(data);
    } catch (e: any) {
      throw new Error(this.firstError(e) ?? 'No se pudo obtener el producto');
    }
  }

  /** GET /productosBuscar/{search}/ */
  async search(search: string): Promise<ProductApi[]> {
    try {
      const data = await firstValueFrom(this.api.get<any>(ProductService.SEARCH(search)));
      const arr: unknown[] = Array.isArray(data) ? data : (data?.data ?? []);
      return (arr as any[]).map(this.normalize);
    } catch (e: any) {
      throw new Error(this.firstError(e) ?? 'No se pudo buscar productos');
    }
  }

  /** POST /productos */
  async create(input: CreateProductDto): Promise<CreateProductResult> {
    try {
      const resp = await firstValueFrom(this.api.post<any>(ProductService.BASE, input));
      const ok = resp?.success === true || resp?.ok === true || true;
      const rawId = resp?.id;
      const id = rawId != null && rawId !== true ? String(rawId) : undefined;
      return { ok, id, raw: resp };
    } catch (e: any) {
      throw new Error(this.firstError(e) ?? 'No se pudo crear el producto');
    }
  }

  /** PUT /productos/{id} */
  async update(id: string, changes: UpdateProductDto): Promise<boolean> {
    try {
      await firstValueFrom(this.api.put<any>(ProductService.BY_ID(id), changes));
      return true;
    } catch (e: any) {
      throw new Error(this.firstError(e) ?? 'No se pudo actualizar el producto');
    }
  }

  /** DELETE /productos/{id} */
  async remove(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.api.delete<any>(ProductService.BY_ID(id)));
      return true;
    } catch (e: any) {
      throw new Error(this.firstError(e) ?? 'No se pudo eliminar el producto');
    }
  }

  /** GET /inventario/stock/{productoId} → { success, stock } */
  async getStock(productoId: string): Promise<number> {
    try {
      const data = await firstValueFrom(this.api.get<any>(ProductService.STOCK(productoId)));
      return this.toNumber(data?.stock ?? 0);
    } catch (e: any) {
      throw new Error(this.firstError(e) ?? 'No se pudo obtener el stock');
    }
  }

  // ============ Compatibilidad con pantallas existentes ============
  /** Devuelve IProduct[] (mapea ProductApi → IProduct) */
  getAllProducts(_: string | undefined = undefined): Observable<IProduct[]> {
    return this.getAll$().pipe(map(list => list.map(this.toIProduct)));
  }
}
