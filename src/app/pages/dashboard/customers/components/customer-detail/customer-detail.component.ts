import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';

registerLocaleData(localeEs);

type EstadoPedido = 'Pendiente' | 'Confirmado' | 'Cancelado';

interface Order {
  id: string;
  createdAt: string | Date;
  items: number;
  total: number;
  estado: EstadoPedido;
}

interface CustomerDetail {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  orders: Order[];
}

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  imports: [IonicModule, CommonModule, RouterModule],
})
export class CustomerDetailComponent implements OnInit {
  customer!: CustomerDetail;

  statusClassMap: Record<EstadoPedido, string> = {
    Pendiente: 'status status--pendiente',
    Confirmado: 'status status--confirmado',
    Cancelado:  'status status--cancelado',
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';

    // DEMO: mapa simple por id
    const map: Record<string, CustomerDetail> = {
      C001: DEMO_CUSTOMER,
      C002: DEMO_CUSTOMER_2,
    };
    this.customer = map[id] ?? DEMO_CUSTOMER;
  }

  back() { history.back(); }
  onMore() { console.log('Más acciones'); }
  openOrder(o: Order) { console.log('Abrir pedido', o.id); }
  trackByOrder(_: number, o: Order) { return o.id; }
}

// ===== Demo =====
const DEMO_CUSTOMER: CustomerDetail = {
  id: 'C001',
  nombre: 'Juan Pérez',
  email: 'juan.perez@example.com',
  telefono: '555-1234',
  direccion: 'Av. Siempre Viva 123, Ciudad',
  orders: [
    { id: '#B002', createdAt: '2024-10-18T15:49:00', items: 2, total: 750, estado: 'Pendiente' },
    { id: '#B003', createdAt: '2024-10-18T15:49:00', items: 2, total: 750, estado: 'Pendiente' },
    { id: '#B004', createdAt: '2024-10-18T15:49:00', items: 2, total: 750, estado: 'Confirmado' },
  ],
};

const DEMO_CUSTOMER_2: CustomerDetail = {
  id: 'C002',
  nombre: 'Enrique Flores Gonzales',
  email: 'enrique@example.com',
  telefono: '301-321-3212',
  direccion: 'Cra. 45 #10-23, Bogotá',
  orders: [
    { id: '#B101', createdAt: '2024-11-02T10:15:00', items: 1, total: 120, estado: 'Pendiente' },
    { id: '#B087', createdAt: '2024-10-25T16:40:00', items: 3, total: 980, estado: 'Confirmado' },
    { id: '#B065', createdAt: '2024-10-12T09:05:00', items: 2, total: 450, estado: 'Cancelado' },
  ],
};
