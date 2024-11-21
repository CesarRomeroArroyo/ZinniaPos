import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { ProgressListComponent } from 'src/app/shared/components/progress-list/progress-list.component';
import { CustomerUpsertComponent } from '../../../customers/components/customer-upsert/customer-upsert.component';
import { BusinessHoursComponent } from '../business-hours/business-hours.component';
import { IListTask } from 'src/app/core/consts/types/progress-list.type';

@Component({
  selector: 'app-initial-setting',
  templateUrl: './initial-setting.component.html',
  styleUrls: ['./initial-setting.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ProgressListComponent
  ]
})
export class InitialSettingComponent implements OnInit {

  public initialTask: IListTask[] = [];

  constructor(
    private _modalCtrl: ModalController,
  ) { }

  ngOnInit(): void {
    this.defineTasks();
  }

  private defineTasks(): void {
    this.initialTask = [
      {
          label: "Registrar clientes/pacientes",
          completed: false,
          onClick: () => this.goToUpsertCustomers(this.initialTask[0])
      },
      {
          label: "Establecer horarios de atención",
          completed: false,
          onClick: () => this.goToBusinessHours(this.initialTask[1])
      }
    ];
  }

  private async goToBusinessHours(task: IListTask) {
    const modal = await this._modalCtrl.create({
      component: BusinessHoursComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data?.completed) { task.completed = true; }
  }

  private async goToUpsertCustomers(task: IListTask) {
    const modal = await this._modalCtrl.create({
      component: CustomerUpsertComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data?.completed) { task.completed = true; }
  }

}
