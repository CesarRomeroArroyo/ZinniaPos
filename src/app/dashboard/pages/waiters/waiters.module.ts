import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitersPageRoutingModule } from './waiters-routing.module';

import { WaitersPage } from './waiters.page';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitersPageRoutingModule,
    ComponentsModule
  ],
  declarations: [WaitersPage]
})
export class WaitersPageModule {}
