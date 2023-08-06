import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminItemPageRoutingModule } from './admin-item-routing.module';

import { AdminItemPage } from './admin-item.page';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminItemPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [AdminItemPage]
})
export class AdminItemPageModule {}
