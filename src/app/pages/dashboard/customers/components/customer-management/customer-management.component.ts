import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

type Origen = 'whatsapp' | 'app' | 'web' | 'tel';

export interface Customer {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  pedidos: number;
  lastOrderDate?: string | Date;
  origen?: Origen;
}

@Component({
  selector: 'app-customer-management',
  standalone: true,
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class CustomerManagementComponent implements OnInit {
  constructor(private router: Router) {}

  // UI
  loading = false;
  error?: string;
  query = '';

  // data
  customers: Customer[] = [];
  filtered: Customer[] = [];

  skeletons = Array.from({ length: 6 });

  ngOnInit(): void {
    this.loadDemo(true);
  }

  async toggleData() {
    await this.loadDemo(this.customers.length === 0);
  }

  async loadDemo(withData: boolean) {
    this.loading = true;
    await new Promise(r => setTimeout(r, 300));
    this.customers = withData ? DEMO_CUSTOMERS : [];
    this.applyFilter();
    this.loading = false;
  }

  // filtros/búsqueda
  applyFilter() {
    const q = this.query.trim().toLowerCase();
    let out = [...this.customers];

    if (q) {
      out = out.filter(c =>
        (c.nombre || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.telefono || '').toLowerCase().includes(q)
      );
    }

    out.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
    this.filtered = out;
  }

  clearSearch() {
    this.query = '';
    this.applyFilter();
  }

  reload(ev?: CustomEvent) {
    this.applyFilter();
    (ev?.target as HTMLIonRefresherElement)?.complete();
  }

  // Navegación al detalle con el ID real
  open(c: Customer) {
    this.router.navigate(['/dashboard/customers', c.id]);
  }

  onCreate() { console.log('Crear cliente'); }
  onAdd()    { console.log('Añadir cliente'); }

  openWhatsApp(c: Customer, ev?: Event) {
    ev?.stopPropagation();       // evita navegar cuando pulsas el icono
    if (!c.telefono) return;
    const phone = c.telefono.replace(/\D/g, '');
    const msg = `Hola ${c.nombre}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  trackById(_: number, c: Customer) { return c.id; }
}

// ===== Demo data =====
const DEMO_CUSTOMERS: Customer[] = [
  { id: 'C001', nombre: 'Juan Pérez', email: 'juan.perez@example.com', telefono: '555 1234', pedidos: 2, lastOrderDate: '2024-10-18', origen: 'whatsapp' },
  { id: 'C002', nombre: 'Enrique Flores Gonzales', email: 'enrique@example.com', telefono: '301 3213212', pedidos: 0, origen: 'app' },
  { id: 'C003', nombre: 'Mauricio Rodríguez Munoz', email: 'mauricio@example.com', telefono: '321 3213256', pedidos: 0, origen: 'web' },
  { id: 'C004', nombre: 'Carol Martinez Minera', email: 'carol@example.com', telefono: '300 5698954', pedidos: 5, lastOrderDate: '2024-10-18', origen: 'tel' },
];
