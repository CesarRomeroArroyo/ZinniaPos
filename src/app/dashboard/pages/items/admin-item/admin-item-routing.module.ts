import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminItemPage } from './admin-item.page';

const routes: Routes = [
  {
    path: '',
    component: AdminItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminItemPageRoutingModule {}
