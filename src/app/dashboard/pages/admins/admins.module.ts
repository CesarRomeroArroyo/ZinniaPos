import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminsPageRoutingModule } from './admins-routing.module';

import { AdminsPage } from './admins.page';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AdminsPage]
})
export class AdminsPageModule {}
