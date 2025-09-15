// src/app/core/consts/types/progress-list.type.ts
import { Type } from '@angular/core';

export interface IListTask {
  id?: string;                 // 👈 único por ítem (lo generamos si no viene)
  label: string;
  completed: boolean;
  route?: string | any[];      // 👈 para navegar sin modal
  component?: Type<any>;       // 👈 para abrir modal dinámico
  onClick?: () => void;        // se genera si no hay route
}
