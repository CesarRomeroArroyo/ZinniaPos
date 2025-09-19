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

type UIOrderStatus =
  | "Pendiente"
  | "Confirmado"
  | "Entregado"
  | "Cancelado"
  | string;

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

  /** Guarda el pedido crudo por id para poder armar el pref al abrir detalle */
  private originalById = new Map<string, any>();

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
      await this.loadOrdersWithFallback(); // trae pedidos con fallback

      // 👇 Hidratamos el conteo desde el detalle si en la lista venía 0
      //    (se va actualizando progresivamente en pantalla)
      this.hydrateCountsFromDetail();
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
          (x: any) => String(x?.id ?? x?._id ?? x?.cliente_id ?? "") === this.id
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
    } catch {
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
    // guarda original para abrir detalle luego
    this.originalById.set(String(o.id), o);

    const dateStr = String(o.fecha ?? o.created_at ?? "").replace(" ", "T");
    const d = dateStr ? new Date(dateStr) : null;

    // Conteo robusto de artículos (si la lista trae arrays o totales)
    const itemsCount = this.unitsFromAny(o);

    const s = String(o.estado ?? "").toLowerCase();
    const status: UIOrderStatus =
      s === "pendiente"
        ? "Pendiente"
        : s === "confirmado"
        ? "Confirmado"
        : s === "entregado"
        ? "Entregado"
        : s === "cancelado"
        ? "Cancelado"
        : o.estado || "";

    return {
      id: String(o.id),
      status,
      date: d && !Number.isNaN(d.getTime()) ? d : null,
      itemsCount,
      total: Number(o.total ?? 0),
    };
  };

  // ====== Conteo robusto de unidades ======
  private unitsFromAny(o: any): number {
    const arr =
      (Array.isArray(o?.items) && o.items) ||
      (Array.isArray(o?.detalle) && o.detalle) ||
      (Array.isArray(o?.detalles) && o.detalles) ||
      (Array.isArray(o?.detalle_pedido) && o.detalle_pedido) ||
      (Array.isArray(o?.detalles_pedido) && o.detalles_pedido) ||
      // 👇 alias camelCase adicionales
      (Array.isArray(o?.detallePedido) && o.detallePedido) ||
      (Array.isArray(o?.detallesPedido) && o.detallesPedido) ||
      (Array.isArray(o?.productos) && o.productos) ||
      (Array.isArray(o?.productosPedido) && o.productosPedido) ||
      (Array.isArray(o?.itemsPedido) && o.itemsPedido) ||
      (Array.isArray(o?.order_items) && o.order_items) ||
      (Array.isArray(o?.line_items) && o.line_items) ||
      null;

    if (arr) {
      let sum = 0;
      for (const it of arr) {
        const rawQty =
          it?.cantidad ??
          it?.qty ??
          it?.quantity ??
          it?.cant ??
          it?.cantidad_producto ??
          it?.cantidadProducto ??
          it?.units ??
          it?.unidades ??
          it?.cantidadItem ??
          it?.cantidadArticulos ??
          it?.cantidadPedido;
        const n = Number(rawQty);
        sum += Number.isFinite(n) && n > 0 ? n : 1;
      }
      return sum;
    }

    const fields = [
      o?.cantidad_total,
      o?.total_cantidad,
      o?.total_unidades,
      o?.unidades_total,
      o?.qty_total,
      o?.quantity_total,
      o?.sum_cantidades,
      o?.items_count,
      o?.productos_count,
      o?.cantidad_items,
      o?.cantidad_articulos,
      o?.articulos,
      o?.itemsLength,
      o?.total_items,
      o?.totalItems,
    ]
      .map((v) => (v != null ? Number(v) : NaN))
      .filter((n) => Number.isFinite(n) && n >= 0) as number[];
    if (fields.length) return Math.max(...fields);

    const len =
      (Array.isArray(o?.items) && o.items.length) ||
      (Array.isArray(o?.detalle) && o.detalle.length) ||
      (Array.isArray(o?.detalles) && o.detalles.length) ||
      (Array.isArray(o?.detalle_pedido) && o.detalle_pedido.length) ||
      (Array.isArray(o?.detalles_pedido) && o.detalles_pedido.length) ||
      (Array.isArray(o?.detallePedido) && o.detallePedido.length) ||
      (Array.isArray(o?.detallesPedido) && o.detallesPedido.length) ||
      (Array.isArray(o?.productos) && o.productos.length) ||
      (Array.isArray(o?.productosPedido) && o.productosPedido.length) ||
      (Array.isArray(o?.itemsPedido) && o.itemsPedido.length) ||
      (Array.isArray(o?.order_items) && o.order_items.length) ||
      (Array.isArray(o?.line_items) && o.line_items.length) ||
      0;

    return len;
  }

  private toPref(o: any) {
    const rawItems =
      (Array.isArray(o?.items) && o.items) ||
      (Array.isArray(o?.detalle) && o.detalle) ||
      (Array.isArray(o?.detalles) && o.detalles) ||
      (Array.isArray(o?.detalle_pedido) && o.detalle_pedido) ||
      (Array.isArray(o?.detalles_pedido) && o.detalles_pedido) ||
      (Array.isArray(o?.order_items) && o.order_items) ||
      (Array.isArray(o?.line_items) && o.line_items) ||
      (Array.isArray(o?.productos) && o.productos) ||
      [];

    const items = rawItems.map((it: any) => ({
      productId:
        it?.producto_id ??
        it?.product_id ??
        it?.id ??
        it?.producto?.id ??
        it?.product?.id,
      productUniqueId:
        it?.idunico_producto ??
        it?.producto?.idunico ??
        it?.product?.idunico ??
        null,
      nombre:
        it?.nombre ??
        it?.producto_nombre ??
        it?.product_name ??
        it?.producto?.nombre ??
        it?.product?.name,
      cantidad:
        Number(
          it?.cantidad ??
            it?.qty ??
            it?.quantity ??
            it?.cant ??
            it?.cantidad_producto ??
            1
        ) || 1,
      precio: it?.precio_venta ?? it?.precio ?? undefined,
      subtotal: it?.subtotal ?? it?.total_linea ?? undefined,
      imageUrl:
        it?.imagen ??
        it?.url_imagen ??
        it?.image_url ??
        it?.producto?.imagen ??
        it?.product?.image ??
        null,
    }));

    let itemsCount = 0;
    for (const it of items) itemsCount += Number(it.cantidad || 1);

    const dateStr = String(
      o?.fecha ?? o?.created_at ?? o?.fecha_pedido ?? o?.fecha_creacion ?? ""
    ).replace(" ", "T");
    const fecha = dateStr ? new Date(dateStr) : null;

    const total = o?.total ?? o?.monto_total ?? o?.importe ?? null;

    return {
      id: String(o?.id ?? ""),
      estado: o?.estado ?? o?.status ?? "",
      fecha: fecha && !Number.isNaN(fecha.getTime()) ? fecha : null,
      total: total != null ? Number(total) : null,
      cliente_id: String(
        o?.cliente_id ?? o?.cliente?.id ?? o?.customer_id ?? ""
      ),
      numero_celular: String(
        o?.numero_celular ??
          o?.telefono ??
          o?.celular ??
          o?.cliente?.telefono ??
          ""
      ),
      cliente_nombre:
        o?.cliente_nombre ||
        o?.nombre_cliente ||
        o?.cliente?.nombre ||
        o?.cliente?.name ||
        "",
      // opcionales, por si vienen embebidos
      cliente_correo: o?.cliente?.correo ?? o?.cliente?.email ?? undefined,
      cliente_direccion:
        o?.cliente?.direccion ?? o?.cliente?.address ?? undefined,
      items,
      itemsCount,
    };
  }

  private readonly ORDER_DETAIL_PATH = [
    "/dashboard",
    "orders",
    "orders-detail",
  ];

  async openOrder(id: string) {
    let raw = this.originalById.get(String(id));

    if (
      (!raw || this.unitsFromAny(raw) === 0) &&
      typeof (this.orderSrv as any).getById === "function"
    ) {
      try {
        const res = await (this.orderSrv as any).getById(String(id));
        raw = (res && (res.data || res.pedido)) || res || null;
      } catch {
        /* ignorar */
      }
    }

    const pref = raw
      ? this.toPref(raw)
      : { id: String(id), items: [], itemsCount: 0 };

    // 👇 añadimos bandera fromCustomer
    this.nav.navigateForward(["/dashboard", "orders", "order", id], {
      state: { pref, fromCustomer: true },
    });
  }

  // ====== Hidratación del conteo desde el detalle ======
  private async hydrateCountsFromDetail() {
    const srv: any = this.orderSrv as any;
    if (typeof srv.getById !== "function") return;

    // solo los que están en 0 (o sin arreglo en lista)
    const targets = this.orders.filter(
      (o) => !o.itemsCount || o.itemsCount === 0
    );
    if (!targets.length) return;

    // pequeña concurrencia para no saturar
    const concurrency = 5;
    let i = 0;
    const run = async () => {
      while (i < targets.length) {
        const idx = i++;
        const ui = targets[idx];
        try {
          const res = await srv.getById(String(ui.id));
          const det = (res && (res.data || res.pedido)) || res || null;
          if (det) {
            const units = this.unitsFromAny(det);
            if (
              Number.isFinite(units) &&
              units >= 0 &&
              units !== ui.itemsCount
            ) {
              // mutamos el objeto para que change detection lo pinte
              ui.itemsCount = units;

              // guardamos el original para openOrder()
              this.originalById.set(String(ui.id), det);
            }
          }
        } catch {
          /* ignorar para seguir con los demás */
        }
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(concurrency, targets.length) }, () => run())
    );
  }

  // ====== UI helpers ======
  pillClass(o: UIOrder) {
    const s = (o.status || "").toLowerCase();
    if (s.includes("pend")) return "pill pill--pendiente";
    if (s.includes("conf")) return "pill pill--confirmado";
    if (s.includes("entre") || s.includes("entreg"))
      return "pill pill--entregado";
    if (s.includes("canc")) return "pill pill--cancelado";
    return "pill";
  }

  trackOrderId(_: number, o: UIOrder) {
    return o.id;
  }
}
