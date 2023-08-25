import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminCategoriesPageRoutingModule } from './admin-categories-routing.module';

import { AdminCategoriesPage } from './admin-categories.page';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminCategoriesPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [AdminCategoriesPage]
})
export class AdminCategoriesPageModule {}
