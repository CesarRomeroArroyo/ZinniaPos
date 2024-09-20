import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralCategory } from 'src/app/core/models/general_category_model';
import { ProxyService } from 'src/app/core/services/proxy.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  public data: any;
  public columns: Array<any> = [];
  public categoies : GeneralCategory[] = [];
  constructor(
    public translationService: TranslationService,
    private proxyService: ProxyService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.columns = [
      {title: 'Categoria', name: 'name'}
    ];
    this.getCategories();
  }

  async getCategories(){
    this.categoies = await this.proxyService.getMethod("list/general_category/");
    this.data = this.categoies;
  }

  goTo(url:any){
    this.router.navigate([url]);
  }

  goEdit(data: any){
    this.goTo("/dashboard/admin-categories/"+data.id);
  }

  async goDelete($event: any) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar esta categoría?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            // Proceder con la eliminación si el usuario confirma
            const response = await this.proxyService.deleteMethod("delete/general_category", $event.id);
            if (response) {
              const toast = await this.toastController.create({
                message: this.translationService.translate('Se eliminó el dato exitosamente'),
                duration: 1500,
                position: 'bottom',
                color: 'success'
              });
              await toast.present();
              this.getCategories();
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
  
}
