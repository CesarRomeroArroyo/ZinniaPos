import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [DataTableComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  exports:[DataTableComponent]
})
export class ComponentsModule { }
