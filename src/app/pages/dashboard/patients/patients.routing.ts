import { Routes } from '@angular/router';
import { PatientManagementComponent } from './components/patient-management/patient-management.component';

export const patientsRoutes: Routes = [
  { path: '', component: PatientManagementComponent, data: { showTab: true, title: 'Pacientes' } },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/patient-detail/patient-detail.component')
        .then(m => m.PatientDetailComponent),
  },
];
