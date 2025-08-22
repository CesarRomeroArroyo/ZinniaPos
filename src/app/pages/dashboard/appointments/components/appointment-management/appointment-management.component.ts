import { Component, OnInit } from "@angular/core";
import { CommonModule, registerLocaleData } from "@angular/common";
import localeEs from "@angular/common/locales/es";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule, MenuController } from "@ionic/angular";

registerLocaleData(localeEs);

type Status = "Agendada" | "Completada" | "Cancelada";
type Origen = "whatsapp" | "app" | "web" | "tel";

export interface Appointment {
  id: string;
  paciente: string;
  date: string | Date;
  start: string;
  end: string;
  type: string;
  status: Status;
  origen?: Origen;
  telefono?: string;
  updatedAt?: string; // para “Fecha de actualización” (fallback a date)
}

@Component({
  selector: "app-appointment-management",
  standalone: true,
  templateUrl: "./appointment-management.component.html",
  styleUrls: ["./appointment-management.component.scss"],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class AppointmentManagementComponent implements OnInit {
  constructor(private menuCtrl: MenuController) {}

  // UI state
  loading = false;
  error?: string;

  // búsqueda / filtros
  query = "";
  activeFilter: string | null = null; // <- texto del chip “Filtros activos”

  // data
  appointments: Appointment[] = [];
  filtered: Appointment[] = [];
  grouped: { label: string; items: Appointment[] }[] = [];

  // opciones de filtro
  statusOptions: Status[] = ["Agendada", "Completada", "Cancelada"];
  origenOptions: Origen[] = ["whatsapp", "app", "web", "tel"];
  updatedDateOptions = [
    { label: "Hoy", value: "hoy" },
    { label: "Últimos 7 días", value: "7d" },
    { label: "Últimos 30 días", value: "30d" },
    { label: "Todo", value: "todo" },
  ] as const;

  // selección de filtros
  selectedStatuses = new Set<Status>();
  selectedOrigen = new Set<Origen>();
  dateFilter: "hoy" | "7d" | "30d" | "todo" = "todo";

  // chips de estado (para CSS)
  public statusClassMap: Record<Status, string> = {
    Agendada: "status--agendada",
    Completada: "status--completada",
    Cancelada: "status--cancelada",
  };

  // skeleton helper
  skeletons = Array.from({ length: 5 });

  ngOnInit(): void {
    this.loadDemo(true);
  }

  // ====== Menu control ======
  openFilters() {
    this.menuCtrl.open("filters");
  }
  closeFilters() {
    this.menuCtrl.close("filters");
  }

  resetFilters() {
    this.selectedStatuses.clear();
    this.selectedOrigen.clear();
    this.dateFilter = "hoy";
    this.applyFilter(); // NEW: actualiza lista y chip
  }

  applyAndClose() {
    this.applyFilter();
    this.closeFilters();
  }

  // ====== Demo: alternar con/sin citas ======
  async toggleData() {
    const has = this.appointments.length > 0;
    await this.loadDemo(!has);
  }

  async loadDemo(withData: boolean) {
    this.loading = true;
    this.error = undefined;
    await new Promise((r) => setTimeout(r, 300));
    this.appointments = withData ? DEMO_APPOINTMENTS : [];
    this.applyFilter();
    this.loading = false;
  }

  reload(ev?: CustomEvent) {
    this.applyFilter();
    (ev?.target as HTMLIonRefresherElement)?.complete();
  }

  // ====== Filtros / búsqueda ======
  applyFilter() {
    const q = this.query.trim().toLowerCase();
    const base = [...this.appointments];

    // texto
    let out = !q
      ? base
      : base.filter(
          (a) =>
            a.id.toLowerCase().includes(q) ||
            a.paciente.toLowerCase().includes(q) ||
            a.type.toLowerCase().includes(q)
        );

    // estado
    if (this.selectedStatuses.size) {
      out = out.filter((a) => this.selectedStatuses.has(a.status));
    }

    // origen
    if (this.selectedOrigen.size) {
      out = out.filter((a) => a.origen && this.selectedOrigen.has(a.origen));
    }

    // fecha de actualización
    if (this.dateFilter !== "todo") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let from = new Date(today);
      if (this.dateFilter === "7d") from.setDate(today.getDate() - 7);
      if (this.dateFilter === "30d") from.setDate(today.getDate() - 30);
      // 'hoy' => from = today

      out = out.filter((a) => {
        const ref = new Date(a.updatedAt ?? a.date);
        ref.setHours(0, 0, 0, 0);
        return ref >= from;
      });
    }

    this.filtered = out;
    this.grouped = this.groupByDay(this.filtered);

    // NEW: actualiza el texto del chip (debajo del buscador)
    this.activeFilter = this.buildActiveFilterLabel();
  }

  // NEW: arma el texto “Agendada, Completada • whatsapp • Hoy”
  private buildActiveFilterLabel(): string | null {
    const parts: string[] = [];

    if (this.selectedStatuses.size) {
      parts.push(Array.from(this.selectedStatuses).join(", "));
    }
    if (this.selectedOrigen.size) {
      parts.push(Array.from(this.selectedOrigen).join(", "));
    }
    if (this.dateFilter !== "todo") {
      const label = this.updatedDateOptions.find(
        (o) => o.value === this.dateFilter
      )?.label;
      if (label) parts.push(label);
    }

    return parts.length ? parts.join(" • ") : null;
  }

  toggleStatus(s: Status, checked: boolean) {
    checked ? this.selectedStatuses.add(s) : this.selectedStatuses.delete(s);
  }
  toggleOrigen(o: Origen, checked: boolean) {
    checked ? this.selectedOrigen.add(o) : this.selectedOrigen.delete(o);
  }

  clearSearch() {
    this.query = "";
    this.applyFilter();
  }
  clearFilter() {
    this.resetFilters();
  }

  // ====== Helpers UI ======
  open(a: Appointment) {
    console.log("Abrir cita", a);
  }

  openWhatsApp(a: Appointment, ev?: Event) {
    ev?.stopPropagation();
    if (!a.telefono) return;
    const phone = a.telefono.replace(/\D/g, "");
    const msg = `Hola ${a.paciente}, sobre tu cita ${a.id}`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  trackById(_: number, a: Appointment) {
    return a.id;
  }

  private groupByDay(items: Appointment[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const map = new Map<string, Appointment[]>();

    for (const a of items) {
      const d = new Date(a.date);
      d.setHours(0, 0, 0, 0);
      const label =
        d.getTime() === today.getTime()
          ? "Hoy"
          : this.capitalize(d.toLocaleDateString("es-ES", { weekday: "long" }));

      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(a);
    }

    const order = Array.from(map.entries()).sort((A, B) => {
      const dA = new Date(A[1][0].date).getTime();
      const dB = new Date(B[1][0].date).getTime();
      return dA - dB;
    });

    for (const [, arr] of order) {
      arr.sort((x, y) => x.start.localeCompare(y.start));
    }

    return order.map(([label, items]) => ({ label, items }));
  }

  private capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // ====== Callbacks header/buttons ======
  onCreate(): void {
    console.log("Crear cita");
  }
  onAdd(): void {
    console.log("Añadir cita");
  }
  onFilter(): void {
    this.openFilters();
  }
}

// ====== Datos de ejemplo ======
const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: "#B002",
    paciente: "Juan Pérez",
    date: "2024-10-18",
    start: "09:00",
    end: "10:00",
    type: "Consulta Especializada",
    status: "Agendada",
    origen: "whatsapp",
    telefono: "573001112233",
    updatedAt: "2024-10-18",
  },
  {
    id: "#B003",
    paciente: "Juan Pérez",
    date: "2024-10-18",
    start: "10:30",
    end: "11:00",
    type: "Consulta General",
    status: "Agendada",
    origen: "app",
    updatedAt: "2024-10-18",
  },
  {
    id: "#B004",
    paciente: "Juan Pérez",
    date: "2024-10-18",
    start: "11:30",
    end: "12:00",
    type: "Consulta Especializada",
    status: "Completada",
    origen: "web",
    updatedAt: "2024-10-19",
  },
  {
    id: "#B005",
    paciente: "Juan Pérez",
    date: "2024-10-19",
    start: "09:00",
    end: "10:00",
    type: "Consulta General",
    status: "Cancelada",
    origen: "whatsapp",
    telefono: "573224445566",
    updatedAt: "2024-10-19",
  },
  {
    id: "#B006",
    paciente: "Juan Pérez",
    date: "2024-10-19",
    start: "10:30",
    end: "11:30",
    type: "Consulta Especializada",
    status: "Agendada",
    origen: "tel",
    updatedAt: "2024-10-20",
  },
];
