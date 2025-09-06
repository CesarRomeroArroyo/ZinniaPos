// src/app/core/services/bussiness/order.service.ts
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../data/api.service';
import { IOrder } from 'src/app/core/interfaces/bussiness/order.interface';

/* ========= Tipos ========= */
export type PedidoEstado =
  | 'pendiente'
  | 'confirmado'
  | 'entregado'
  | 'cancelado'
  | string;

export interface PedidoItemApi {
  producto_id: number;
  cantidad: number;
  nombre?: string;
  precio_venta?: number;
  subtotal?: number;
}

export interface PedidoApi {
  id: string;
  cliente_id: string;
  numero_celular?: string;
  estado?: PedidoEstado;
  total?: number;
  fecha?: string; // 'YYYY-MM-DD HH:mm:ss' | ISO
  items?: PedidoItemApi[];
}

export interface PedidosByTelefonoResp {
  success: boolean;
  cliente: any | null;
  pendientes: PedidoApi[];
  confirmados: PedidoApi[];
  entregados: PedidoApi[];
}

export interface CreatePedidoDto {
  cliente_id: number | string;
  numero_celular?: string;
  items: Array<{ producto_id: number | string; cantidad: number | string }>;
  estado?: PedidoEstado;
}

export interface CreatePedidoResult {
  ok: boolean;
  id?: string;
  raw?: any;
}

/* ========= Helpers ========= */
type BackendErrors = Record<string, string | string[]>;

/** Busca la PRIMERA colección de pedidos en cualquier forma común */
function extractArrayDeep(raw: any): any[] {
  if (Array.isArray(raw)) return raw;

  const tryKeys = (obj: any, keys: string[]): any[] | null => {
    for (const k of keys) {
      const v = obj?.[k];
      if (Array.isArray(v)) return v;
      if (v && typeof v === 'object') {
        // { data: { data: [] } }, { data: { pedidos: [] }}, etc.
        const inner = tryKeys(v, keys);
        if (inner) return inner;
      }
    }
    return null;
  };

  // claves típicas
  const keys = ['data', 'pedidos', 'orders', 'results', 'rows', 'items', 'list'];
  const hit = tryKeys(raw, keys);
  if (hit) return hit;

  // si no encontró, busca el array MÁS largo en propiedades de 1–2 niveles
  let best: any[] | null = null;
  const scan = (obj: any, depth = 0) => {
    if (!obj || typeof obj !== 'object' || depth > 2) return;
    for (const v of Object.values(obj)) {
      if (Array.isArray(v)) {
        if (!best || v.length > best.length) best = v;
      } else if (v && typeof v === 'object') {
        scan(v, depth + 1);
      }
    }
  };
  scan(raw, 0);
  return best ?? [];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  // SOLO estas rutas
  private static readonly PATH = '/pedidos';
  private static readonly PATH_BY_ID = (id: string | number) =>
    `/pedidos/${encodeURIComponent(String(id))}`;
  private static readonly PATH_BY_CLIENTE = (clienteId: string | number) =>
    `/pedidos/cliente/${encodeURIComponent(String(clienteId))}`;
  private static readonly PATH_BY_TELEFONO = (tel: string) =>
    `/pedidos/by-telefono/${encodeURIComponent(tel)}/`;

  constructor(private api: ApiService) {}

  /* ===== Normalización ===== */
  private normalizeItem = (it: any): PedidoItemApi => ({
    producto_id: Number(it?.producto_id ?? it?.productoId ?? it?.id ?? 0),
    cantidad: Number(it?.cantidad ?? it?.qty ?? 0),
    nombre: it?.nombre ?? it?.producto_nombre ?? it?.productoNombre ?? undefined,
    precio_venta:
      it?.precio_venta != null
        ? Number(it.precio_venta)
        : it?.precio != null
        ? Number(it.precio)
        : undefined,
    subtotal: it?.subtotal != null ? Number(it.subtotal) : undefined,
  });

  private normalize = (raw: any): PedidoApi => ({
    id: String(raw?.id ?? ''),
    cliente_id: String(raw?.cliente_id ?? raw?.clienteId ?? ''),
    numero_celular: raw?.numero_celular ?? raw?.telefono ?? raw?.celular ?? '',
    estado: raw?.estado ?? '',
    total: raw?.total != null ? Number(raw.total) : undefined,
    fecha:
      raw?.fecha ??
      raw?.fecha_pedido ??
      raw?.fecha_creacion ??
      raw?.created_at ??
      raw?.createdAt ??
      raw?.updated_at ??
      '',
    items: Array.isArray(raw?.items)
      ? raw.items.map(this.normalizeItem)
      : Array.isArray(raw?.detalles)
      ? raw.detalles.map(this.normalizeItem)
      : undefined,
  });

  private onlyDigits(tel?: string) {
    return (tel || '').toString().replace(/\D/g, '');
  }

  private firstError(err: any): string | undefined {
    if (typeof err?.error?.message === 'string' && err.error.message.trim())
      return err.error.message.trim();
    const errors = (err?.error?.errors ?? err?.errors) as BackendErrors | undefined;
    if (errors && typeof errors === 'object') {
      const v = Object.values(errors)[0];
      if (Array.isArray(v)) return String(v[0] ?? '').trim() || undefined;
      if (typeof v === 'string') return v.trim() || undefined;
    }
    if (typeof err?.message === 'string' && err.message.trim())
      return err.message.trim();
    return undefined;
  }

  /* =======================
   *          GET
   * ======================= */

  /** GET /pedidos */
  async getPedidos(): Promise<PedidoApi[]> {
    const raw = await firstValueFrom(this.api.get<any>(OrderService.PATH));
    const arr = extractArrayDeep(raw);
    return arr.map(this.normalize);
  }

  /**
   * GET /pedidos con ?page&limit si tu backend los soporta; si no, cae a getPedidos()
   */
  async getPedidosAll(opts?: { pageSize?: number; maxPages?: number }): Promise<PedidoApi[]> {
    const pageSize = Math.max(1, Math.min(500, opts?.pageSize ?? 100));
    const maxPages = Math.max(1, opts?.maxPages ?? 50);
    const collected: PedidoApi[] = [];

    try {
      for (let page = 1; page <= maxPages; page++) {
        const url = `${OrderService.PATH}?page=${page}&limit=${pageSize}`;
        const raw = await firstValueFrom(this.api.get<any>(url));
        const chunk = extractArrayDeep(raw).map(this.normalize);
        collected.push(...chunk);

        // heurística de fin:
        const hasMore =
          raw?.next === true ||
          typeof raw?.links?.next === 'string' ||
          (raw?.meta?.current_page && raw?.meta?.last_page
            ? raw.meta.current_page < raw.meta.last_page
            : undefined);

        if (chunk.length < pageSize || hasMore === false) break;
      }
      if (collected.length) return collected;
    } catch {
      // si falla paginación, cae a GET simple
    }

    return this.getPedidos();
  }

  /** GET /pedidos/:id */
  async getById(id: string | number): Promise<PedidoApi> {
    const raw = await firstValueFrom(this.api.get<any>(OrderService.PATH_BY_ID(id)));
    const entity = raw?.data ?? raw;
    return this.normalize(entity);
  }

  /** GET /pedidos/cliente/:clienteId */
  async getByCliente(clienteId: string | number): Promise<PedidoApi[]> {
    const raw = await firstValueFrom(this.api.get<any>(OrderService.PATH_BY_CLIENTE(clienteId)));
    return extractArrayDeep(raw).map(this.normalize);
  }

  /** GET /pedidos/by-telefono/:tel/ */
  async getByTelefono(telefono: string): Promise<PedidosByTelefonoResp> {
    const tel = this.onlyDigits(telefono);
    if (!tel) {
      return { success: false, cliente: null, pendientes: [], confirmados: [], entregados: [] };
    }
    const raw = await firstValueFrom(this.api.get<any>(OrderService.PATH_BY_TELEFONO(tel)));
    const pendientes  = extractArrayDeep(raw?.pendientes).map(this.normalize);
    const confirmados = extractArrayDeep(raw?.confirmados).map(this.normalize);
    const entregados  = extractArrayDeep(raw?.entregados).map(this.normalize);
    return { success: !!raw?.success, cliente: raw?.cliente ?? null, pendientes, confirmados, entregados };
  }

  /** Para pantallas que consumen IOrder[] */
  getAllOrders(clienteId: string | number): Observable<IOrder[]> {
    return this.api.get<any>(OrderService.PATH_BY_CLIENTE(clienteId)).pipe(
      map((data: any) => extractArrayDeep(data).map(this.normalize).map(this.toIOrder))
    );
  }

  /* ===== Conversión a IOrder ===== */
  private toIso(dateLike?: string): string {
    if (!dateLike) return new Date().toISOString();
    const t = dateLike.includes('T') ? dateLike : dateLike.replace(' ', 'T');
    const d = new Date(t);
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }

  private toIOrder = (p: PedidoApi): IOrder => {
    const itemsSrc = p.items ?? [];
    const subtotal = itemsSrc.reduce((acc, it) => {
      const price = it?.precio_venta ?? 0;
      const qty = it?.cantidad ?? 0;
      const sub = it?.subtotal ?? price * qty;
      return acc + (Number.isFinite(sub) ? sub : 0);
    }, 0);

    const iso = this.toIso(p.fecha);

    const customerMinimal = {
      id: p.cliente_id,
      name: '',
      phone: p.numero_celular ?? '',
    } as any;

    const itemsForOrder = itemsSrc.map((it) => ({
      productId: it.producto_id,
      quantity: it.cantidad,
      price: it.precio_venta ?? 0,
      subtotal: it.subtotal ?? (it.precio_venta ?? 0) * (it.cantidad ?? 0),
      name: it.nombre ?? undefined,
    })) as unknown as IOrder['items'];

    return {
      id: p.id as any,
      customerId: p.cliente_id as any,
      customer: customerMinimal,
      phone: p.numero_celular ?? '',
      status: (p.estado as any) ?? '',
      total: p.total ?? subtotal,
      subtotal,
      origin: 'api',
      createAt: iso,
      updateAt: iso,
      items: itemsForOrder,
      date: p.fecha ?? '',
    } as unknown as IOrder;
  };

  /* =======================
   *        CREATE
   * ======================= */

 /** Crea pedido tolerando respuestas 200/201 con cuerpo vacío o no-JSON */
async createPedido(input: CreatePedidoDto): Promise<CreatePedidoResult> {
  const clienteIdNum =
    typeof input.cliente_id === 'string' ? Number(input.cliente_id) : input.cliente_id;
  if (!clienteIdNum || !input.items?.length) {
    throw new Error('Datos incompletos para crear el pedido');
  }

  // form-url-encoded como espera tu API
  const form: Record<string, any> = { cliente_id: String(clienteIdNum) };

  const onlyDigits = (t: string) => (t || '').toString().replace(/\D/g, '');
  const tel = onlyDigits(input.numero_celular || '');
  if (tel) form['numero_celular'] = tel;
  if (input.estado) form['estado'] = input.estado;

  input.items.forEach((it, i) => {
    form[`items[${i}][producto_id]`] = String(Number(it.producto_id));
    form[`items[${i}][cantidad]`]    = String(Number(it.cantidad));
  });

  try {
    // 🚀 Intento normal (esperando JSON)
    const resp: any = await firstValueFrom(
      this.api.postUrlEncoded<any>(OrderService.PATH, form)
    );

    // Si llegó JSON, perfecto
    const id =
      resp?.id != null && resp?.id !== true
        ? String(resp.id)
        : resp?.data?.id != null
        ? String(resp.data.id)
        : undefined;

    return { ok: true, id, raw: resp };

  } catch (e: any) {
    // 🧯 Fallback: muchos backends devuelven 200/201 con HTML o vacío → Angular lanza "parsing error"
    const status = Number(e?.status ?? 0);
    const msg: string = String(e?.message ?? '');
    const bodyText: string =
      typeof e?.error === 'string' ? e.error :
      typeof e?.error?.text === 'string' ? e.error.text : '';

    const is2xx = status >= 200 && status < 300; // a veces Angular marca ok:false pero status=200
    const looksLikeParsing =
      /parsing/i.test(msg) || /Unexpected token/i.test(msg) ||
      /<!DOCTYPE|<html/i.test(bodyText);

    // Si parece que el servidor sí procesó (2xx) pero falló el parseo → lo tomamos como éxito
    if (is2xx || looksLikeParsing) {
      return { ok: true, raw: e };
    }

    // Errores reales
    const first =
      (typeof e?.error?.message === 'string' && e.error.message.trim()) ? e.error.message.trim() :
      (typeof e?.message === 'string' && e.message.trim()) ? e.message.trim() :
      'No se pudo crear el pedido';
    throw new Error(first);
  }
}


  async createPedidoAsEntity(input: CreatePedidoDto): Promise<PedidoApi> {
    const res = await this.createPedido(input);
    if (res.raw && (res.raw.pedido || res.raw.data)) {
      return this.normalize(res.raw.pedido ?? res.raw.data);
    }
    if (res.id) return this.getById(res.id);
    if (res.raw) return this.normalize(res.raw);
    throw new Error('Pedido creado, pero no fue posible recuperar la entidad.');
  }
}
