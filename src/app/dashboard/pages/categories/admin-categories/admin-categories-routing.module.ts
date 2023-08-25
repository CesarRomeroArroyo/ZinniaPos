import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminCategoriesPage } from './admin-categories.page';

const routes: Routes = [
  {
    path: '',
    component: AdminCategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminCategoriesPageRoutingModule {}
