import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

type Origen = 'whatsapp' | 'app' | 'web' | 'tel';

export interface Patient {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  citas: number;
  lastAppointmentDate?: string | Date;
  origen?: Origen;
}

@Component({
  selector: 'app-patient-management',
  standalone: true,
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class PatientManagementComponent implements OnInit {
  constructor(private router: Router) {}

  // UI
  loading = false;
  error?: string;
  query = '';

  // data
  patients: Patient[] = [];
  filtered: Patient[] = [];

  skeletons = Array.from({ length: 6 });

  ngOnInit(): void {
    this.loadDemo(true);
  }

  async toggleData() {
    await this.loadDemo(this.patients.length === 0);
  }

  async loadDemo(withData: boolean) {
    this.loading = true;
    await new Promise(r => setTimeout(r, 300));
    this.patients = withData ? DEMO_PATIENTS : [];
    this.applyFilter();
    this.loading = false;
  }

  // filtros/búsqueda
  applyFilter() {
    const q = this.query.trim().toLowerCase();
    let out = [...this.patients];

    if (q) {
      out = out.filter(p =>
        (p.nombre || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.telefono || '').toLowerCase().includes(q)
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

  // Navegar a detalle (si luego creas patient-detail)
  open(p: Patient) {
    this.router.navigate(['/dashboard/patients', p.id]);
  }

  onCreate() { console.log('Crear cita'); }
  onAdd()    { console.log('Añadir paciente'); }

  openWhatsApp(p: Patient, ev?: Event) {
    ev?.stopPropagation();       // evita navegar cuando pulsas el icono
    if (!p.telefono) return;
    const phone = p.telefono.replace(/\D/g, '');
    const msg = `Hola ${p.nombre}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  trackById(_: number, p: Patient) { return p.id; }
}

// ===== Demo data =====
const DEMO_PATIENTS: Patient[] = [
  { id: 'P001', nombre: 'Juan Pérez',    email: 'juan.perez@example.com',    telefono: '555 1234',    citas: 2, lastAppointmentDate: '2024-10-18', origen: 'whatsapp' },
  { id: 'P002', nombre: 'Enrique Flores Gonzales', email: 'enrique@example.com', telefono: '301 3213212', citas: 0, origen: 'app' },
  { id: 'P003', nombre: 'Mauricio Rodríguez Munoz', email: 'mauricio@example.com', telefono: '321 3213256', citas: 0, origen: 'web' },
  { id: 'P004', nombre: 'Carol Martinez Minera', email: 'carol@example.com', telefono: '300 5698954', citas: 5, lastAppointmentDate: '2024-10-18', origen: 'tel' },
];
