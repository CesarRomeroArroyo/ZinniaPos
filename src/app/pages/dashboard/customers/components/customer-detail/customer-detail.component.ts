// src/app/pages/dashboard/customers/components/customer-detail/customer-detail.component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, NavController } from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { ClientesService } from "src/app/core/services/bussiness/clientes.service";
import {
  OrderService,
  PedidoApi,
} from "src/app/core/services/bussiness/order.service";

type UIOrderStatus = "Pendiente" | "Confirmado" | "Entregado" | "Cancelado" | string;

interface UICustomer {
  id: string;
  nombre: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
}

interface UIOrder {
  id: string;
  status: UIOrderStatus;
  date?: Date | null;
  itemsCount: number;
  total: number;
}

@Component({
  selector: "app-customer-detail",
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule],
  templateUrl: "./customer-detail.component.html",
  styleUrls: ["./customer-detail.component.scss"],
})
export class CustomerDetailComponent implements OnInit {
  loading = false;
  error?: string;

  customer?: UICustomer | null;
  orders: UIOrder[] = [];

  private id = "";

  constructor(
    private route: ActivatedRoute,
    private nav: NavController,
    private clientesSrv: ClientesService,
    private orderSrv: OrderService
  ) {}

  ngOnInit(): void {
    this.id = String(this.route.snapshot.paramMap.get("id") || "");
    this.load();
  }

  async load(ev?: CustomEvent) {
    this.loading = true;
    this.error = undefined;
    try {
      await this.loadCustomer();
      await this.loadOrdersWithFallback();   // 👈 trae pedidos con fallback
    } catch (e: any) {
      this.error = e?.message || "No se pudo cargar el cliente";
    } finally {
      this.loading = false;
      (ev?.target as HTMLIonRefresherElement)?.complete?.();
    }
  }

  // ===== Navegación atrás con fallback =====
  goBack() {
    if (history.length > 1) this.nav.back();
    else this.nav.navigateBack(["/customers"]);
  }

  // ====== Data ======
  private async loadCustomer() {
    let raw: any = null;

    // si tienes getClienteById úsalo; si no, busca en la lista
    const anySrv: any = this.clientesSrv as any;
    if (typeof anySrv.getClienteById === "function") {
      raw = await anySrv.getClienteById(this.id);
    } else {
      const list: any[] = await this.clientesSrv.getClientes();
      raw =
        list.find(
          (x: any) =>
            String(x?.id ?? x?._id ?? x?.cliente_id ?? "") === this.id
        ) ?? null;
    }

    if (!raw) {
      this.customer = null;
      throw new Error("Cliente no encontrado");
    }

    this.customer = this.toUICustomer(raw);
  }

  /** Intenta primero por cliente_id; si viene vacío y hay teléfono, intenta por teléfono */
  private async loadOrdersWithFallback() {
    let arr: PedidoApi[] = [];

    // 1) por cliente_id
    try {
      arr = await this.orderSrv.getByCliente(this.id);
    } catch (e) {
      // ignora; probamos fallback
    }

    // 2) fallback por teléfono si no hay pedidos y tenemos teléfono
    const phone = (this.customer?.telefono || "").toString().replace(/\D/g, "");
    if ((!arr || arr.length === 0) && phone) {
      const srv: any = this.orderSrv as any;
      try {
        if (typeof srv.getByTelefonoFlat === "function") {
          arr = await srv.getByTelefonoFlat(phone);
        } else if (typeof srv.getByTelefono === "function") {
          const r = await srv.getByTelefono(phone);
          arr = [
            ...(r?.pendientes ?? []),
            ...(r?.confirmados ?? []),
            ...(r?.entregados ?? []),
          ];
        }
      } catch {
        // no tirar la pantalla, seguimos con vacío
      }
    }

    // mapear a UI y ordenar por fecha desc
    this.orders = (arr ?? []).map(this.toUIOrder).sort((a, b) => {
      const ta = a.date ? a.date.getTime() : 0;
      const tb = b.date ? b.date.getTime() : 0;
      return tb - ta;
    });
  }

  // ====== Mappers ======
  private toUICustomer = (c: any): UICustomer => ({
    id: String(c?.id ?? c?._id ?? c?.cliente_id ?? ""),
    nombre: String(c?.nombre ?? c?.name ?? "").trim(),
    correo: (c?.correo ?? c?.email ?? "") || undefined,
    telefono: (c?.telefono ?? c?.phone ?? c?.celular ?? "") || undefined,
    direccion: (c?.direccion ?? c?.address ?? "") || undefined,
  });

  private toUIOrder = (o: PedidoApi): UIOrder => {
    const dateStr = String(o.fecha ?? "").replace(" ", "T");
    const d = dateStr ? new Date(dateStr) : null;

    const itemsCount =
      Array.isArray(o.items)
        ? o.items.reduce((acc, it: any) => acc + Number(it?.cantidad ?? 0), 0)
        : 0;

    const s = String(o.estado ?? "").toLowerCase();
    const status: UIOrderStatus =
      s === "pendiente"  ? "Pendiente"  :
      s === "confirmado" ? "Confirmado" :
      s === "entregado"  ? "Entregado"  :
      s === "cancelado"  ? "Cancelado"  : (o.estado || "");

    return {
      id: String(o.id),
      status,
      date: d && !Number.isNaN(d.getTime()) ? d : null,
      itemsCount,
      total: Number(o.total ?? 0),
    };
  };

  // ====== UI helpers ======
  pillClass(o: UIOrder) {
    const s = (o.status || "").toLowerCase();
    if (s.includes("pend")) return "pill pill--pendiente";
    if (s.includes("conf")) return "pill pill--confirmado";
    if (s.includes("entre") || s.includes("entreg")) return "pill pill--entregado";
    if (s.includes("canc")) return "pill pill--cancelado";
    return "pill";
  }

  trackOrderId(_: number, o: UIOrder) { return o.id; }
}
