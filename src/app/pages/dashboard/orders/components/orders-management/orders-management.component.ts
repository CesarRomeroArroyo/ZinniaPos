// src/app/pages/dashboard/orders/components/orders-management/orders-management.component.ts
import { Component, OnInit, ViewChild } from "@angular/core";
import { IonicModule, ModalController, IonPopover } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {
  HttpBackend,
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";
import { firstValueFrom } from "rxjs";

import {
  OrderService,
  PedidoApi,
  PedidoEstado,
} from "src/app/core/services/bussiness/order.service";
import { CreateOrderComponent } from "../create-order/create-order.component";
import {
  ClientesService,
  ClienteApi,
} from "src/app/core/services/bussiness/clientes.service";

/** Filtros UI */
type FechaFiltro = "todas" | "hoy";

interface UiFilters {
  estados: Set<PedidoEstado>;
  canalWhatsapp: boolean;
  fecha: FechaFiltro;
}

interface Grouped {
  label: string;
  items: PedidoApi[];
  epoch: number; // para ordenar grupos por fecha desc
}

@Component({
  selector: "app-orders-management",
  templateUrl: "./orders-management.component.html",
  styleUrls: ["./orders-management.component.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
  ],
})
export class OrdersManagementComponent implements OnInit {
  @ViewChild("filtersPopover", { read: IonPopover, static: false })
  filtersPopover?: IonPopover;

  loading = false;
  error?: string;

  // Dataset
  orders: PedidoApi[] = []; // todos (crudos del backend normalizados)
  filtered: PedidoApi[] = []; // resultado de filtros
  grouped: Grouped[] = []; // agrupado por fecha

  /** filtro de texto local (id/estado/total/teléfono/nombre) */
  query = "";

  /** Estado de filtros UI */
  filters: UiFilters = {
    estados: new Set<PedidoEstado>(),
    canalWhatsapp: false,
    fecha: "todas",
  };

  // URL ABSOLUTA (bypassa interceptores)
  private readonly ABS_URL =
    "https://codigofuentecorp.eastus.cloudapp.azure.com/zinnia-apis-php/public/pedidos";

  // HttpClient sin interceptores
  private httpNoIx: HttpClient;

  /** índices locales para resolver nombre de cliente */
  private clientesById = new Map<string, string>();
  private clientesByPhone = new Map<string, string>();

  constructor(
    private ordersSrv: OrderService,
    private modalCtrl: ModalController,
    backend: HttpBackend,
    private clientesSrv: ClientesService
  ) {
    this.httpNoIx = new HttpClient(backend);
  }

  ngOnInit() {
    this.loadAll();
  }

  /** ========== CARGA PRINCIPAL ========== */
  async loadAll() {
    this.loading = true;
    this.error = undefined;

    try {
      const [pedidos, clientes] = await Promise.all([
        this.getViaHttpBackend().catch(async () => [] as PedidoApi[]),
        this.getClientesSafe(),
      ]);

      this.orders = pedidos.length
        ? pedidos
        : await this.ordersSrv.getPedidos();

      // Indexar clientes
      this.buildClienteIndices(clientes || []);

      // Enriquecer cada pedido con cliente_nombre y dejar itemsCount ya calculado
      this.orders = this.orders.map((o: any) => {
        o.cliente_nombre = this.getClienteNombre(o);
        // si por alguna razón no vino en normalizeOrder, intenta calcular aquí
        if (typeof o.itemsCount !== "number")
          o.itemsCount = this.computeItemsCount(o);
        return o as PedidoApi;
      });

      this.runFiltersAndGrouping();
    } catch (e: any) {
      console.error("[Orders] loadAll error →", e);
      this.error = e?.message || "Error al cargar pedidos";
      this.orders = [];
      this.filtered = [];
      this.grouped = [];
    } finally {
      this.loading = false;
    }
  }

  /** GET /pedidos sin interceptores y con parseo robusto */
  private async getViaHttpBackend(): Promise<PedidoApi[]> {
    const text = await firstValueFrom(
      this.httpNoIx.get(this.ABS_URL, { responseType: "text" })
    );

    const parsed = this.parseMaybeJson(text);
    const arr = this.extractArrayDeep(parsed);
    return arr.map(this.normalizeOrder);
  }

  private async getClientesSafe(): Promise<ClienteApi[] | null> {
    try {
      return await this.clientesSrv.getClientes();
    } catch {
      return null;
    }
  }

  private buildClienteIndices(clientes: ClienteApi[]) {
    this.clientesById.clear();
    this.clientesByPhone.clear();
    for (const c of clientes) {
      const id = String((c as any).id ?? "");
      const nombre = String((c as any).nombre ?? (c as any).name ?? "");
      const tel = String((c as any).telefono ?? (c as any).celular ?? "").replace(/\D/g, "");
      if (id && nombre) this.clientesById.set(id, nombre);
      if (tel && nombre) this.clientesByPhone.set(tel, nombre);
    }
  }

  getClienteNombre(o: any): string {
    const id = String(o?.cliente_id ?? "").trim();
    const tel = String(o?.numero_celular ?? "").replace(/\D/g, "");

    // Usa mapas si existen en el componente (no falla si no están)
    const byId: Map<string, string> | undefined = (this as any).clientesById;
    const byTel: Map<string, string> | undefined = (this as any).clientesByPhone;

    if (id && byId?.has?.(id)) return byId.get(id)!;
    if (tel && byTel?.has?.(tel)) return byTel.get(tel)!;

    // Campos embebidos posibles
    const emb =
      o?.cliente_nombre ||
      o?.nombre_cliente ||
      o?.cliente?.nombre ||
      o?.cliente?.name ||
      "";
    return String(emb || "");
  }

  private parseMaybeJson(text: string): any {
    try {
      return JSON.parse(text);
    } catch {
      const i = text.indexOf("[");
      const j = text.lastIndexOf("]");
      if (i >= 0 && j > i) {
        try {
          return JSON.parse(text.slice(i, j + 1));
        } catch {
          return {};
        }
      }
      const oi = text.indexOf("{");
      const oj = text.lastIndexOf("}");
      if (oi >= 0 && oj > oi) {
        try {
          return JSON.parse(text.slice(oi, oj + 1));
        } catch {
          return {};
        }
      }
      return {};
    }
  }

  getItemsCount(o: any): number {
    const arr =
      (Array.isArray(o?.items) && o.items) ||
      (Array.isArray(o?.detalle) && o.detalle) ||
      (Array.isArray(o?.productos) && o.productos) ||
      (Array.isArray(o?.order_items) && o.order_items) ||
      null;

    if (arr) {
      let sum = 0;
      for (const it of arr) {
        const qty = Number(it?.cantidad ?? it?.qty ?? it?.quantity ?? 1);
        sum += Number.isFinite(qty) && qty > 0 ? qty : 1;
      }
      return sum;
    }

    const agg = [
      o?.items_count,
      o?.productos_count,
      o?.cantidad_items,
      o?.cantidad_articulos,
      o?.articulos,
      o?.itemsLength,
      o?.total_items,
    ]
      .map((v) => (v != null ? Number(v) : NaN))
      .filter((n) => Number.isFinite(n) && n >= 0) as number[];

    return agg.length ? Math.max(...agg) : 0;
  }

  private extractArrayDeep(raw: any): any[] {
    if (Array.isArray(raw)) return raw;
    const keys = [
      "data",
      "pedidos",
      "orders",
      "results",
      "rows",
      "items",
      "list",
    ];
    const tryKeys = (o: any): any[] | null => {
      for (const k of keys) {
        const v = o?.[k];
        if (Array.isArray(v)) return v;
        if (v && typeof v === "object") {
          const r = tryKeys(v);
          if (r) return r;
        }
      }
      return null;
    };
    const hit = tryKeys(raw);
    if (hit) return hit;

    let best: any[] | null = null;
    const scan = (o: any, d = 0) => {
      if (!o || typeof o !== "object" || d > 2) return;
      for (const v of Object.values(o)) {
        if (Array.isArray(v)) {
          if (!best || v.length > best.length) best = v;
        } else if (v && typeof v === "object") {
          scan(v, d + 1);
        }
      }
    };
    scan(raw, 0);
    return best ?? [];
  }

  /** Normalizador local (+ itemsCount calculado en TS) */
  private normalizeOrder = (raw: any): PedidoApi => {
    // Construye objeto base
    const obj: any = {
      id: String(raw?.id ?? ""),
      cliente_id: String(raw?.cliente_id ?? raw?.clienteId ?? ""),
      numero_celular:
        raw?.numero_celular ?? raw?.telefono ?? raw?.celular ?? "",
      estado: raw?.estado ?? "",
      total: raw?.total != null ? Number(raw.total) : undefined,
      fecha:
        raw?.fecha ??
        raw?.fecha_pedido ??
        raw?.fecha_creacion ??
        raw?.created_at ??
        raw?.createdAt ??
        raw?.updated_at ??
        "",
      items: Array.isArray(raw?.items)
        ? raw.items.map((it: any) => ({
            producto_id: Number(
              it?.producto_id ?? it?.productoId ?? it?.id ?? 0
            ),
            cantidad: Number(it?.cantidad ?? it?.qty ?? 0),
            nombre:
              it?.nombre ??
              it?.producto_nombre ??
              it?.productoNombre ??
              undefined,
            precio_venta:
              it?.precio_venta != null
                ? Number(it.precio_venta)
                : it?.precio != null
                ? Number(it.precio)
                : undefined,
            subtotal: it?.subtotal != null ? Number(it.subtotal) : undefined,
          }))
        : undefined,
    };

    // ✅ Conteo robusto de artículos
    obj.itemsCount = this.computeItemsCount({ ...raw, items: obj.items });

    return obj as PedidoApi;
  };

  /** Cuenta el total de artículos (suma cantidades si existen) */
  private computeItemsCount(o: any): number {
    const arr =
      (Array.isArray(o?.items) && o.items) ||
      (Array.isArray(o?.detalle) && o.detalle) ||
      (Array.isArray(o?.productos) && o.productos) ||
      (Array.isArray(o?.order_items) && o.order_items) ||
      null;

    if (arr) {
      let sum = 0;
      for (const it of arr) {
        const qty = Number(it?.cantidad ?? it?.qty ?? it?.quantity ?? 1);
        sum += Number.isFinite(qty) && qty > 0 ? qty : 1;
      }
      return sum;
    }

    const agg = [
      o?.items_count,
      o?.productos_count,
      o?.cantidad_items,
      o?.cantidad_articulos,
      o?.articulos,
      o?.itemsLength,
      o?.total_items,
    ]
      .map((v) => (v != null ? Number(v) : NaN))
      .filter((n) => Number.isFinite(n) && n >= 0) as number[];

    return agg.length ? Math.max(...agg) : 0;
  }

  // ---------- Getters útiles ----------
  get activeFiltersCount(): number {
    let n = 0;
    if (this.filters.estados.size) n++;
    if (this.filters.canalWhatsapp) n++;
    if (this.filters.fecha === "hoy") n++;
    return n;
  }
  get estadosArray(): PedidoEstado[] {
    return Array.from(this.filters.estados) as PedidoEstado[];
  }

  // ---------- Filtros ----------
  applyQueryFilter() {
    this.runFiltersAndGrouping();
  }
  applyFilters() {
    this.filtersPopover?.dismiss();
    this.runFiltersAndGrouping();
  }
  clearSearch() {
    this.query = "";
    this.applyQueryFilter();
  }

  clearAllFilters() {
    this.filters = {
      estados: new Set<PedidoEstado>(),
      canalWhatsapp: false,
      fecha: "todas",
    };
    this.runFiltersAndGrouping();
  }

  removeFilterChip(
    kind: "estado" | "whatsapp" | "fecha",
    value?: PedidoEstado
  ) {
    if (kind === "estado" && value) this.filters.estados.delete(value);
    else if (kind === "whatsapp") this.filters.canalWhatsapp = false;
    else if (kind === "fecha") this.filters.fecha = "todas";
    this.runFiltersAndGrouping();
  }

  toggleEstado(e: PedidoEstado) {
    if (this.filters.estados.has(e)) this.filters.estados.delete(e);
    else this.filters.estados.add(e);
  }

  // ---------- Pipeline de filtrado + agrupado ----------
  private runFiltersAndGrouping() {
    // 1) base
    let arr = [...this.orders] as any[];

    // 2) query texto (incluye nombre)
    const q = (this.query || "").trim().toLowerCase();
    if (q) {
      arr = arr.filter((o) => {
        const id = (o.id ?? "").toLowerCase();
        const est = (o.estado ?? "").toLowerCase();
        const tel = (o.numero_celular ?? "").toLowerCase();
        const tot = o.total != null ? String(o.total) : "";
        const nom = (
          o.cliente_nombre ??
          this.getClienteNombre(o) ??
          ""
        ).toLowerCase();
        return (
          id.includes(q) ||
          est.includes(q) ||
          tel.includes(q) ||
          tot.includes(q) ||
          nom.includes(q)
        );
      });
    }

    // 3) filtros UI
    if (this.filters.estados.size) {
      arr = arr.filter((o) =>
        this.filters.estados.has((o.estado || "").toLowerCase() as PedidoEstado)
      );
    }
    if (this.filters.canalWhatsapp) {
      arr = arr.filter(
        (o) =>
          !!(
            o.numero_celular &&
            (o.numero_celular + "").replace(/\D/g, "").length >= 7
          )
      );
    }
    if (this.filters.fecha === "hoy") {
      const todayStr = this.onlyDateISO(new Date());
      arr = arr.filter(
        (o) => this.onlyDateISO(this.asDate(o.fecha)) === todayStr
      );
    }

    this.filtered = arr as PedidoApi[];

    // 4) AGRUPAR por fecha
    type Bucket = { label: string; items: PedidoApi[]; epoch: number };
    const byDate = new Map<string, Bucket>();

    for (const o of arr) {
      const d = this.asDate((o as any).fecha);
      const key = this.onlyDateISO(d);
      const epoch = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate()
      ).getTime();
      const label = this.dateLabel(d);

      if (!byDate.has(key)) byDate.set(key, { label, items: [], epoch });
      byDate.get(key)!.items.push(o as PedidoApi);
    }

    const groups: Grouped[] = Array.from(byDate.values())
      .map((g) => ({
        label: g.label,
        epoch: g.epoch,
        items: (g.items as any[]).sort(
          (a, b) =>
            this.asDate((b as any).fecha).getTime() -
            this.asDate((a as any).fecha).getTime()
        ) as PedidoApi[],
      }))
      .sort((a, b) => b.epoch - a.epoch);

    this.grouped = groups;
  }

  // ---------- Helpers de fecha ----------
  asDate(dateLike?: string): Date {
    if (!dateLike) return new Date();
    const t = dateLike.includes("T") ? dateLike : dateLike.replace(" ", "T");
    const d = new Date(t);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }
  private onlyDateISO(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  }
  private dateLabel(d: Date): string {
    const today = new Date();
    const dOnly = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    ).getTime();
    const tOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();
    const diff = (dOnly - tOnly) / 86400000;

    if (diff === 0) return "Hoy";
    if (diff === -1) return "Ayer";

    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return days[d.getDay()];
  }

  // ---------- UI helpers ----------
  statusClass(est?: PedidoEstado) {
    const e = (est || "").toLowerCase();
    return {
      status: true,
      pending: e === "pendiente",
      confirmed: e === "confirmado",
      delivered: e === "entregado",
      canceled: e === "cancelado",
    };
  }

  openWhatsApp(o: PedidoApi, ev: Event) {
    ev.stopPropagation();
    const tel = (o.numero_celular || "").replace(/\D/g, "");
    if (!tel) return;
    window.open(`https://wa.me/${tel}`, "_blank");
  }

  trackById(_: number, o: PedidoApi) {
    return o.id;
  }

  // ➕ botón para crear pedido
  async onAdd() {
    const modal = await this.modalCtrl.create({
      component: CreateOrderComponent,
      cssClass: "option-select-modal",
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.completed) await this.loadAll();
  }

  // ---------- NUEVO: prefetch para enviar al detalle ----------
  /** Empaqueta datos clave del pedido y sus items para history.state */
  toPref(o: any) {
    const rawItems =
      (Array.isArray(o?.items) && o.items) ||
      (Array.isArray(o?.detalle) && o.detalle) ||
      (Array.isArray(o?.productos) && o.productos) ||
      (Array.isArray(o?.order_items) && o.order_items) ||
      [];

    const items = rawItems.map((it: any) => ({
      productId:
        it?.producto_id ?? it?.product_id ?? it?.id ?? it?.producto?.id ?? it?.product?.id,
      productUniqueId:
        it?.idunico_producto ?? it?.producto?.idunico ?? it?.product?.idunico ?? null,
      nombre:
        it?.nombre ?? it?.producto_nombre ?? it?.product_name ?? it?.producto?.nombre ?? it?.product?.name,
      cantidad: Number(it?.cantidad ?? it?.qty ?? 1) || 1,
      precio: it?.precio_venta ?? it?.precio ?? undefined,
      subtotal: it?.subtotal ?? it?.total_linea ?? undefined,
      imageUrl:
        it?.imagen ?? it?.url_imagen ?? it?.image_url ?? it?.producto?.imagen ?? it?.product?.image ?? null,
    }));

    let itemsCount = 0;
    for (const it of items) itemsCount += Number(it.cantidad || 1);

    return {
      id: String(o?.id ?? ""),
      estado: o?.estado ?? "",
      fecha: o?.fecha ?? o?.created_at ?? null,
      total: o?.total ?? null,
      cliente_id: String(o?.cliente_id ?? o?.cliente?.id ?? ""),
      numero_celular: String(o?.numero_celular ?? o?.cliente?.telefono ?? ""),
      // usa el índice local por si no viene embebido
      cliente_nombre:
        this.getClienteNombre(o) ||
        o?.cliente_nombre ||
        o?.nombre_cliente ||
        o?.cliente?.nombre ||
        o?.cliente?.name ||
        "",
      items,
      itemsCount,
    };
  }
}
