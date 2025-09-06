import { Component, OnInit, ViewChild } from "@angular/core";
import { IonicModule, ModalController, IonPopover } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import {
  OrderService,
  PedidoApi,
  PedidoEstado,
} from "src/app/core/services/bussiness/order.service";
import { CreateOrderComponent } from "../create-order/create-order.component";

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
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
})
export class OrdersManagementComponent implements OnInit {
  @ViewChild("filtersPopover", { read: IonPopover, static: false })
  filtersPopover?: IonPopover;

  loading = false;
  error?: string;

  // Dataset
  orders: PedidoApi[] = [];   // todos (crudos del backend normalizados)
  filtered: PedidoApi[] = []; // resultado de filtros
  grouped: Grouped[] = [];    // agrupado por fecha

  /** filtro de texto local (id/estado/total/teléfono) */
  query = "";

  /** Estado de filtros UI */
  filters: UiFilters = {
    estados: new Set<PedidoEstado>(),
    canalWhatsapp: false,
    fecha: "todas",
  };

  constructor(
    private ordersSrv: OrderService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    // ✅ carga inicial: TODOS con paginación + fallback simple
    this.loadAll();
  }

  /** Trae TODOS (paginado) con fallback y log */
 async loadAll() {
  this.loading = true;
  this.error = undefined;

  try {
    let data: PedidoApi[] = [];

    // 1) Paginado
    try {
      data = await this.ordersSrv.getPedidosAll({ pageSize: 100, maxPages: 200 });
      console.log('[Orders] paginado:', data.length);
    } catch {
      // ignoramos para intentar fallback
    }

    // 2) Fallback a GET simple
    if (!Array.isArray(data) || data.length === 0) {
      data = await this.ordersSrv.getPedidos();
      console.log('[Orders] simple:', data.length);
    }

    this.orders = data ?? [];
    this.runFiltersAndGrouping();

  } catch (e: any) {
    this.error = e?.message || 'Error al cargar pedidos';
    this.orders = [];
    this.filtered = [];
    this.grouped = [];
    console.error('[Orders] loadAll error:', e);
  } finally {
    this.loading = false;
  }
}


  // ---------- Getters útiles ----------
  get activeFiltersCount(): number {
    let n = 0;
    if (this.filters.estados.size) n++;
    if (this.filters.canalWhatsapp) n++;
    if (this.filters.fecha === "hoy") n++;
    return n;
  }

  /** Evita usar Array.from(...) en el template */
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

  removeFilterChip(kind: "estado" | "whatsapp" | "fecha", value?: PedidoEstado) {
    if (kind === "estado" && value) {
      this.filters.estados.delete(value);
    } else if (kind === "whatsapp") {
      this.filters.canalWhatsapp = false;
    } else if (kind === "fecha") {
      this.filters.fecha = "todas";
    }
    this.runFiltersAndGrouping();
  }

  toggleEstado(e: PedidoEstado) {
    if (this.filters.estados.has(e)) this.filters.estados.delete(e);
    else this.filters.estados.add(e);
  }

  // ---------- Pipeline de filtrado + agrupado ----------
  private runFiltersAndGrouping() {
    // 1) base
    let arr = [...this.orders];

    // 2) query texto
    const q = (this.query || "").trim().toLowerCase();
    if (q) {
      arr = arr.filter((o) => {
        const id = (o.id ?? "").toLowerCase();
        const est = (o.estado ?? "").toLowerCase();
        const tel = (o.numero_celular ?? "").toLowerCase();
        const tot = o.total != null ? String(o.total) : "";
        return id.includes(q) || est.includes(q) || tel.includes(q) || tot.includes(q);
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
          !!(o.numero_celular && (o.numero_celular + "").replace(/\D/g, "").length >= 7)
      );
    }
    if (this.filters.fecha === "hoy") {
      const todayStr = this.onlyDateISO(new Date());
      arr = arr.filter((o) => this.onlyDateISO(this.asDate(o.fecha)) === todayStr);
    }

    this.filtered = arr;

    // 4) AGRUPAR por fecha real (clave = YYYY-MM-DD).
    type Bucket = { label: string; items: PedidoApi[]; epoch: number };
    const byDate = new Map<string, Bucket>();

    for (const o of arr) {
      const d = this.asDate(o.fecha);
      const key = this.onlyDateISO(d);
      const epoch = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const label = this.dateLabel(d);

      if (!byDate.has(key)) byDate.set(key, { label, items: [], epoch });
      byDate.get(key)!.items.push(o);
    }

    // 5) ordenar items por hora DESC y grupos por fecha DESC
    const groups: Grouped[] = Array.from(byDate.values())
      .map(g => ({
        label: g.label,
        epoch: g.epoch,
        items: g.items.sort((a, b) => this.asDate(b.fecha).getTime() - this.asDate(a.fecha).getTime())
      }))
      .sort((a, b) => b.epoch - a.epoch);

    this.grouped = groups;
  }

  // ---------- Helpers de fecha (públicos para usarlos en el template) ----------
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
    const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const tOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const diff = (dOnly - tOnly) / 86400000;

    if (diff === 0) return "Hoy";
    if (diff === -1) return "Ayer";

    const days = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
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
    if (data?.completed) {
      await this.loadAll();
    }
  }
}
