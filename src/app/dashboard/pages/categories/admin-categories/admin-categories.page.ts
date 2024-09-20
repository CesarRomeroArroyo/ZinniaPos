import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService } from 'src/app/core/services/translation.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProxyService } from 'src/app/core/services/proxy.service';
import { GeneralTax } from 'src/app/core/models/general_tax_model';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.page.html',
  styleUrls: ['./admin-categories.page.scss'],
})
export class AdminCategoriesPage implements OnInit {
  public categoriesForm: FormGroup;
  public taxes: GeneralTax[];
  public isEditMode = false;  // Para saber si estamos en modo edición
  public categoryId: string | null = null;  // Para almacenar el ID de la categoría a editar

  constructor(
    public translationService: TranslationService,
    private location: Location,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private proxyService: ProxyService,
    private router: Router,
    private route: ActivatedRoute  // Para obtener el parámetro de ID si estamos editando
  ) {
    this.categoriesForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.taxes = [];
  }

  ngOnInit() {
    // Verificar si estamos en modo edición
    
  }

  ionViewWillEnter() {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id');  // Obtiene el ID de la categoría
      if (this.categoryId) {
        this.isEditMode = true;
        this.loadCategoryData(this.categoryId);  // Cargar los datos de la categoría para editar
      }
    });
  }

  // Cargar datos de la categoría para editar
  async loadCategoryData(categoryId: string) {
    const response = await this.proxyService.getMethod(`/getById/general_category/${categoryId}`);
    if (response) {
      this.categoriesForm.patchValue({
        name: response[0].name
      });
    }
  }

  // Guardar cambios (creación o actualización)
  async confirmSave() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas guardar los cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Guardado cancelado');
          }
        },
        {
          text: 'Guardar',
          handler: async () => {
            

            let response;
            if (this.isEditMode) {
              const category = { name: this.categoriesForm.value.name, state: 1, id: this.categoryId };
              // Actualizar categoría existente
              response = await this.proxyService.putMethod(`/update/general_category/`, category);
            } else {
              const category = { name: this.categoriesForm.value.name, state: 1 };
              // Crear nueva categoría
              response = await this.proxyService.postMethod('/save/general_category/', category);
            }

            if (response) {
              const toast = await this.toastController.create({
                message: this.translationService.translate('_GENERAL_SAVE_CONFIRM'),
                duration: 1500,
                position: 'bottom',
                color: 'success'
              });
              await toast.present();
              this.router.navigate(["dashboard", "categories"]);
            } else {
              const toast = await this.toastController.create({
                message: this.translationService.translate('_GENERAL_ERROR'),
                duration: 1500,
                position: 'bottom',
                color: 'danger'
              });
              await toast.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  goBack(){
    this.location.back();
  }
}
