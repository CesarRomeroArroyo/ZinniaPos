import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import {
  ClientesService,
  ClienteApi,
} from "src/app/core/services/bussiness/clientes.service";
import { ModalController } from "@ionic/angular";
import { ProductCustomerComponent } from "../../../products/components/product-customer/product-customer.component";


interface Cliente extends ClienteApi {
  fechaRegistroDate?: Date;
}

@Component({
  selector: "app-prueba-backend",
  standalone: true,
  templateUrl: "./prueba-backend.component.html",
  styleUrls: ["./prueba-backend.component.scss"],
  imports: [CommonModule, IonicModule, HttpClientModule, FormsModule],
})
export class PruebaBackendComponent implements OnInit {
  loading = false;
  error?: string;

  clientes: Cliente[] = [];
  filtered: Cliente[] = [];
  query = "";

  constructor(
    private clientesSrv: ClientesService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.load();
  }

  async load(ev?: CustomEvent) {
    this.loading = true;
    this.error = undefined;
    try {
      const arr = await this.clientesSrv.getClientes();
      this.clientes = arr.map(this.mapCliente);
      this.applyFilter();
    } catch (e: any) {
      this.error = e?.message || "Error al cargar clientes";
    } finally {
      this.loading = false;
      (ev?.target as HTMLIonRefresherElement)?.complete?.();
    }
  }

  private mapCliente = (c: ClienteApi): Cliente => {
    const iso = c.fecha_registro?.replace(" ", "T");
    const fecha = iso ? new Date(iso) : undefined;
    return { ...c, fechaRegistroDate: isNaN(fecha as any) ? undefined : fecha };
  };

  applyFilter() {
    const q = this.query.trim().toLowerCase();
    if (!q) {
      this.filtered = [...this.clientes];
      return;
    }
    this.filtered = this.clientes.filter((c) => {
      const nombre = (c.nombre ?? "").toLowerCase();
      const correo = (c.correo ?? "").toLowerCase(); // 👈 ya normalizado
      const telefono = String(c.telefono ?? "").toLowerCase(); // 👈 evitar error toLowerCase en número
      const direccion = (c.direccion ?? "").toLowerCase();
      return (
        nombre.includes(q) ||
        correo.includes(q) ||
        telefono.includes(q) ||
        direccion.includes(q)
      );
    });
  }

  clearSearch() {
    this.query = "";
    this.applyFilter();
  }

  displaySub(c: Cliente) {
    const parts = [c.correo, c.telefono].filter(Boolean);
    return parts.join(" • ");
  }

  openWhatsApp(c: Cliente, ev?: Event) {
    ev?.stopPropagation();
    const phone = (c.telefono || "").toString().replace(/\D/g, "");
    if (!phone) return;
    window.open(`https://wa.me/${phone}`, "_blank");
  }

  trackById(_: number, c: Cliente) {
    return c.id;
  }

  async onAdd() {
    const modal = await this.modalCtrl.create({
      component: ProductCustomerComponent,
      cssClass: "option-select-modal", // opcional, si ya la usas en otros modales
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.completed) {
      // Si el modal avisa que guardó correctamente, recarga la lista
      this.load();
    }
  }
}
