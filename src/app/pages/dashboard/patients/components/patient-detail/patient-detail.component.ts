import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClientesService, ClienteApi } from 'src/app/core/services/bussiness/clientes.service';

registerLocaleData(localeEs);

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
  imports: [IonicModule, CommonModule, RouterModule],
})
export class PatientDetailComponent implements OnInit {
  patient: any = null;

  constructor(
    private route: ActivatedRoute,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    if (id) {
      this.loadPatient(id);
    }
  }

  private async loadPatient(id: string): Promise<void> {
    try {
      const clientes = await this.clientesService.getClientes();
      const cliente = clientes.find(c => c.id === id);
      
      if (cliente) {
        this.patient = {
          id: cliente.id,
          nombre: cliente.nombre,
          email: cliente.correo,
          telefono: cliente.telefono,
          direccion: cliente.direccion
        };
      }
    } catch (error: any) {
      console.error('Error cargando paciente:', error);
    }
  }

  back() { history.back(); }
  onMore() { console.log('Más acciones'); }
}