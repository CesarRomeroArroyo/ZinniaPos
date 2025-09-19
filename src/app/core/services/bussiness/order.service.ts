// src/app/core/services/bussiness/order.service.ts
import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../data/api.service';
import { IOrder } from 'src/app/core/interfaces/bussiness/order.interface';

export type PedidoEstado = 'pendiente' | 'confirmado' | 'entregado' | 'cancelado' | string;

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
  fecha?: string;
  items?: PedidoItemApi[];
   created_at?: string; 
}
export interface PedidosByTelefonoResp {
  success: boolean;
  cliente: any | null;
  pendientes: PedidoApi[]; confirmados: PedidoApi[]; entregados: PedidoApi[];
}
export interface CreatePedidoDto {
  cliente_id: number | string;
  numero_celular?: string;
  items: Array<{ producto_id: number | string; cantidad: number | string }>;
  estado?: PedidoEstado;
}
export interface CreatePedidoResult { ok: boolean; id?: string; raw?: any; }
type BackendErrors = Record<string, string | string[]>;

/* ========= Utils ========= */
function extractArrayDeep(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  const keys = ['data','pedidos','orders','results','rows','items','list'];
  const tryKeys = (o:any):any[]|null => {
    for (const k of keys) {
      const v = o?.[k];
      if (Array.isArray(v)) return v;
      if (v && typeof v==='object') { const r = tryKeys(v); if (r) return r; }
    }
    return null;
  };
  const hit = tryKeys(raw); if (hit) return hit;
  let best:any[]|null=null;
  const scan=(o:any,d=0)=>{ if(!o||typeof o!=='object'||d>2) return;
    for(const v of Object.values(o)){
      if(Array.isArray(v)){ if(!best||v.length>best.length) best=v; }
      else if(v&&typeof v==='object'){ scan(v,d+1); }
    }
  };
  scan(raw,0);
  return best ?? [];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  // Ruta absoluta para saltar interceptores al pedir /pedidos
  private static readonly ABS_BASE = 'https://codigofuentecorp.eastus.cloudapp.azure.com/zinnia-apis-php/public';

  private static readonly PATH = '/pedidos';
  private static readonly PATH_BY_ID = (id: string | number) => `/pedidos/${encodeURIComponent(String(id))}`;
  private static readonly PATH_BY_CLIENTE = (clienteId: string | number) => `/pedidos/cliente/${encodeURIComponent(String(clienteId))}`;
  private static readonly PATH_BY_TELEFONO = (tel: string) => `/pedidos/by-telefono/${encodeURIComponent(tel)}/`;

  // HttpClient “crudo” que NO pasa por interceptores
  private rawHttp: HttpClient;

  constructor(private api: ApiService, httpBackend: HttpBackend) {
    this.rawHttp = new HttpClient(httpBackend);
  }

  /* ===== Normalización ===== */
  private normalizeItem = (it: any): PedidoItemApi => ({
    producto_id: Number(it?.producto_id ?? it?.productoId ?? it?.id ?? 0),
    cantidad: Number(it?.cantidad ?? it?.qty ?? 0),
    nombre: it?.nombre ?? it?.producto_nombre ?? it?.productoNombre ?? undefined,
    precio_venta: it?.precio_venta != null ? Number(it.precio_venta) : (it?.precio != null ? Number(it.precio) : undefined),
    subtotal: it?.subtotal != null ? Number(it.subtotal) : undefined,
  });

  private normalize = (raw: any): PedidoApi => ({
    id: String(raw?.id ?? ''),
    cliente_id: String(raw?.cliente_id ?? raw?.clienteId ?? ''),
    numero_celular: raw?.numero_celular ?? raw?.telefono ?? raw?.celular ?? '',
    estado: raw?.estado ?? '',
    total: raw?.total != null ? Number(raw.total) : undefined,
    fecha: raw?.fecha ?? raw?.fecha_pedido ?? raw?.fecha_creacion ?? raw?.created_at ?? raw?.createdAt ?? raw?.updated_at ?? '',
    items: Array.isArray(raw?.items) ? raw.items.map(this.normalizeItem)
         : Array.isArray(raw?.detalles) ? raw.detalles.map(this.normalizeItem)
         : undefined,
  });

  private onlyDigits(tel?: string){ return (tel || '').toString().replace(/\D/g, ''); }
  private firstError(err:any):string|undefined{
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

  /* ===== GET (saltando interceptores para /pedidos) ===== */

  /** Usa HttpBackend + responseType:'text' para evitar el modal del interceptor */
  async getPedidos(): Promise<PedidoApi[]> {
    try {
      const url = `${OrderService.ABS_BASE}${OrderService.PATH}`;
      const txt = await firstValueFrom(this.rawHttp.get(url, { responseType: 'text' }));
      // parseo seguro
      let parsed: any = {};
      try { parsed = JSON.parse(txt); } catch {
        const i = txt.indexOf('['), j = txt.lastIndexOf(']');
        if (i>=0 && j>i) { try { parsed = JSON.parse(txt.slice(i, j+1)); } catch {} }
      }
      const arr = extractArrayDeep(parsed);
      return arr.map(this.normalize);
    } catch (e:any) {
      // Fallback a ApiService normal (por si quieres mantener logs)
      const raw = await firstValueFrom(this.api.get<any>(OrderService.PATH));
      const arr = extractArrayDeep(raw);
      return arr.map(this.normalize);
    }
  }

  /** Tu backend no pagina; devolvemos getPedidos() */
  async getPedidosAll(_: { pageSize?: number; maxPages?: number } = {}): Promise<PedidoApi[]> {
    return this.getPedidos();
  }

  /** Los demás endpoints pueden seguir usando ApiService normal */
  async getById(id: string | number): Promise<PedidoApi> {
    const raw = await firstValueFrom(this.api.get<any>(OrderService.PATH_BY_ID(id)));
    const entity = raw?.data ?? raw;
    return this.normalize(entity);
  }

  async getByCliente(clienteId: string | number): Promise<PedidoApi[]> {
    const raw = await firstValueFrom(this.api.get<any>(OrderService.PATH_BY_CLIENTE(clienteId)));
    return extractArrayDeep(raw).map(this.normalize);
  }

  async getByTelefono(telefono: string): Promise<PedidosByTelefonoResp> {
    const tel = this.onlyDigits(telefono);
    if (!tel) return { success:false, cliente:null, pendientes:[], confirmados:[], entregados:[] };
    const raw = await firstValueFrom(this.api.get<any>(OrderService.PATH_BY_TELEFONO(tel)));
    const pendientes  = extractArrayDeep(raw?.pendientes).map(this.normalize);
    const confirmados = extractArrayDeep(raw?.confirmados).map(this.normalize);
    const entregados  = extractArrayDeep(raw?.entregados).map(this.normalize);
    return { success: !!raw?.success, cliente: raw?.cliente ?? null, pendientes, confirmados, entregados };
  }

  /* ===== IOrder (compat) ===== */
  getAllOrders(clienteId: string | number): Observable<IOrder[]> {
    return this.api.get<any>(OrderService.PATH_BY_CLIENTE(clienteId)).pipe(
      map((data: any) => extractArrayDeep(data).map(this.normalize).map(this.toIOrder))
    );
  }
  private toIso(s?:string){ if(!s) return new Date().toISOString(); const t=s.includes('T')?s:s.replace(' ','T'); const d=new Date(t); return isNaN(d.getTime())?new Date().toISOString():d.toISOString(); }
  private toIOrder = (p: PedidoApi): IOrder => {
    const items = p.items ?? [];
    const subtotal = items.reduce((acc,it) => acc + (it.subtotal ?? (it.precio_venta ?? 0) * (it.cantidad ?? 0)), 0);
    const iso = this.toIso(p.fecha);
    return {
      id: p.id as any,
      customerId: p.cliente_id as any,
      customer: { id: p.cliente_id, name: '', phone: p.numero_celular ?? '' } as any,
      phone: p.numero_celular ?? '',
      status: (p.estado as any) ?? '',
      total: p.total ?? subtotal,
      subtotal,
      origin: 'api',
      createAt: iso,
      updateAt: iso,
      items: items.map(it => ({ productId: it.producto_id, quantity: it.cantidad, price: it.precio_venta ?? 0, subtotal: it.subtotal ?? (it.precio_venta ?? 0)*(it.cantidad ?? 0), name: it.nombre })) as any,
      date: p.fecha ?? '',
    } as any;
  };

  /* ===== CREATE (igual que tenías) ===== */
  async createPedido(input: CreatePedidoDto): Promise<CreatePedidoResult> {
    const clienteIdNum = typeof input.cliente_id === 'string' ? Number(input.cliente_id) : input.cliente_id;
    if (!clienteIdNum || !input.items?.length) throw new Error('Datos incompletos para crear el pedido');

    const form: Record<string, any> = { cliente_id: String(clienteIdNum) };
    const onlyDigits = (t:string)=>(t||'').toString().replace(/\D/g,'');
    const tel = onlyDigits(input.numero_celular || '');
    if (tel) form['numero_celular'] = tel;
    if (input.estado) form['estado'] = input.estado;

    input.items.forEach((it,i)=>{
      form[`items[${i}][producto_id]`] = String(Number(it.producto_id));
      form[`items[${i}][cantidad]`]    = String(Number(it.cantidad));
    });

    try {
      const resp: any = await firstValueFrom(this.api.postUrlEncoded<any>(OrderService.PATH, form));
      const id = resp?.id != null && resp?.id !== true ? String(resp.id) :
                 resp?.data?.id != null ? String(resp.data.id) : undefined;
      return { ok:true, id, raw:resp };
    } catch (e:any) {
      const status = Number(e?.status ?? 0);
      const msg = String(e?.message ?? '');
      const txt = typeof e?.error === 'string' ? e.error : (typeof e?.error?.text === 'string' ? e.error.text : '');
      const is2xx = status >= 200 && status < 300;
      const looksParsing = /parsing|Unexpected token/i.test(msg) || /<!DOCTYPE|<html/i.test(txt);
      if (is2xx || looksParsing) return { ok:true, raw:e };
      const first =
        (typeof e?.error?.message === 'string' && e.error.message.trim()) ? e.error.message.trim() :
        (typeof e?.message === 'string' && e.message.trim()) ? e.message.trim() :
        'No se pudo crear el pedido';
      throw new Error(first);
    }
  }

  async createPedidoAsEntity(input: CreatePedidoDto): Promise<PedidoApi> {
    const res = await this.createPedido(input);
    if (res.raw && (res.raw.pedido || res.raw.data)) return this.normalize(res.raw.pedido ?? res.raw.data);
    if (res.id) return this.getById(res.id);
    if (res.raw) return this.normalize(res.raw);
    throw new Error('Pedido creado, pero no fue posible recuperar la entidad.');
  }
}
