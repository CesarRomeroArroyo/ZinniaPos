import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { IListTask } from 'src/app/core/consts/types/progress-list.type';
import { QuickAccessItem } from 'src/app/core/interfaces/quick-access-list.interface';
import { BusinessCategoryId } from 'src/app/core/consts/enums/business/business-category.enum';

import { QuickAccessService } from 'src/app/core/services/utils/quick-access.service';
import { AuthSessionService } from 'src/app/core/services/utils/auth-session.service';
import { InitialBusinessSettingService } from 'src/app/core/services/utils/initial-setting.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';

import { ProgressListComponent } from 'src/app/shared/components/progress-list/progress-list.component';
import { QuickAccessPanelComponent } from 'src/app/shared/components/quick-access-panel/quick-access-panel.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

// ⚠️ Renombramos el import para no chocar con la propiedad de clase
import { settingHeader as settingHeaderCfg } from './initial-setting.consts';

@Component({
  selector: 'app-orders-initial-setting',
  templateUrl: './initial-setting.component.html',
  styleUrls: ['./initial-setting.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ProgressListComponent,
    QuickAccessPanelComponent,
    HeaderComponent,
  ]
})
export class InitialSettingComponent implements OnInit, OnDestroy  {

  public initialTask: IListTask[] = [];
  public businessCategoryId!: BusinessCategoryId | undefined;
  public userQuickAccess: QuickAccessItem[] = [];
  private tasksSubscription?: Subscription;

  // ✅ Propiedad que pide <app-header>
  public settingHeader = settingHeaderCfg;

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly toast: ToastService,
    private readonly auth: AuthSessionService,
    private readonly quickAccess: QuickAccessService,
    private readonly settings: InitialBusinessSettingService,
  ) {}

  // ⚠️ Ionic reutiliza la página: recableamos SIEMPRE al entrar
  ionViewWillEnter() {
    this.loadInitialTasks();
  }

  ngOnInit(): void {
    this.getQuickAccessList();
    this.loadInitialTasks();
    this.subscribeToTasksChanges();
  }

  ngOnDestroy(): void {
    this.tasksSubscription?.unsubscribe();
  }

  public showInitalSettingPanel(): boolean {
    return !this.settings.getSetting()?.completed;
  }

  private getQuickAccessList() {
    this.businessCategoryId = this.auth.getUserCompany()?.category;
    if (this.businessCategoryId) {
      this.userQuickAccess = this.quickAccess.getUserQuickAccess(this.businessCategoryId);
    }
  }

  /** Carga desde el servicio y cablea la acción correcta por tarea */
  private loadInitialTasks(): void {
    const base = this.settings.getInitialUserTask() ?? [];

    // CLONAR + asignar onClick por tarea (sin usar índices)
    this.initialTask = base.map((t) => {
      const task: IListTask = { ...t };
      task.onClick = () => this.handleTask(task);  // cada closure cierra sobre SU task
      return task;
    });
  }

  private subscribeToTasksChanges(): void {
    this.tasksSubscription = this.settings.getTasks$().subscribe({
      next: (tasks: IListTask[]) => {
        const source = tasks?.length ? tasks : (this.settings.getInitialUserTask() ?? []);
        // crear NUEVO array y NUEVOS objetos para que Angular re-pinte
        this.initialTask = source.map((t) => {
          const task: IListTask = { ...t };
          task.onClick = () => this.handleTask(task);
          return task;
        });
      },
      error: (err) => console.error('Error subscribing to tasks changes:', err),
    });
  }

  private async handleTask(task: IListTask) {
    // Abre el componente específico de la tarea (si viene definido)
    if (task.component) {
      const modal = await this.modalCtrl.create({ component: task.component });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data?.completed) task.completed = true; // marca esta tarea como completada
      return;
    }

    
  }

  // ✅ Método que el header invoca con [customActionCompleted]
  public actionCompleted(): void {
    // Pon aquí lo que deba hacer el botón del header (guardar, cerrar, etc.)
    // Ejemplo simple:
   
  }
}
