import {CustomInputComponent} from "../../../../shared/components/custom-input/custom-input.component";
import {Component} from '@angular/core';
import {IonItem, IonLabel, IonList} from '@ionic/angular/standalone';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-business-type',
    templateUrl: './business-type.component.html',
    styleUrls: ['./business-type.component.scss'],
    standalone: true,

    imports: [
        CustomInputComponent, IonItem, IonLabel, IonList, NgForOf, NgClass, IonicModule, NgIf, ReactiveFormsModule
    ]
})
export class BusinessTypeComponent {
  // TODO: Cambiar radio button por ION checkbox

  selectedCategory = new FormControl('');

  categories = [
    {
      id: 'salud',
      title: 'Salud',
      description: 'Clínicas, consultorios, veterinarias…'
    },
    {
      id: 'retail',
      title: 'Retail / Tiendas',
      description: 'Ropa, zapatos, tecnología, alimentos…'
    },
    {
      id: 'servicios',
      title: 'Servicios',
      description: 'Peluquería, limpieza, reparación…'
    },
    {
      id: 'tecnologia',
      title: 'Tecnología',
      description: 'Desarrollo de software, marketing digital…'
    },
    {
      id: 'otro',
      title: 'Otro',
      description: ''
    }
  ];
    constructor() {
    }

    ngOnInit() {
    }

}
