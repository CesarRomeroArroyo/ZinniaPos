import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  { path: '', redirectTo: 'initial-setting', pathMatch: 'full' },

  {
    path: 'initial-setting',
    loadComponent: () =>
      import('./components/initial-setting/initial-setting.component')
        .then(m => m.InitialSettingComponent),
    data: { showTab: true, title: 'Productos' }
  },
];
